package com.jude.englishstudy.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

/**
 * JWT 생성·검증·파싱을 담당한다.
 *
 * <p>예외 처리 흐름:</p>
 * <ul>
 *   <li>{@link #parseClaims(String)} — 파싱 실패 시 {@link JwtTokenException} 발생</li>
 *   <li>{@link #validateToken(String)} — 예외를 catch하여 true/false 반환 (Filter·Security 진입점)</li>
 *   <li>{@link #getClaims(String)}, {@link #getUserId(String)}, {@link #isExpired(String)} — 유효 토큰 전제, 실패 시 예외 전파</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenProvider {

    private static final int MIN_SECRET_KEY_BYTES = 32;

    private final JwtProperties jwtProperties;

    private SecretKey secretKey;

    @PostConstruct
    void init() {
        byte[] secretBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < MIN_SECRET_KEY_BYTES) {
            throw new IllegalStateException(
                    "jwt.secret must be at least %d bytes for HS256".formatted(MIN_SECRET_KEY_BYTES));
        }
        this.secretKey = Keys.hmacShaKeyFor(secretBytes);
    }

    public String createAccessToken(Long userId) {
        return createToken(userId, TokenType.ACCESS, jwtProperties.getAccessTokenExpiration());
    }

    /**
     * Refresh Token 생성.
     * 추후 RefreshToken 엔티티 저장 및 DB 검증 로직과 연동한다.
     */
    public String createRefreshToken(Long userId) {
        return createToken(userId, TokenType.REFRESH, jwtProperties.getRefreshTokenExpiration());
    }

    /**
     * 토큰 유효성 검증 (Filter / Security 진입점).
     * 파싱 예외는 내부에서 처리하고 true/false만 반환한다.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtTokenException exception) {
            log.debug("JWT validation failed [{}]: {}", exception.getErrorCode(), exception.getMessage());
            return false;
        }
    }

    public boolean validateAccessToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return isExpectedTokenType(claims, TokenType.ACCESS);
        } catch (JwtTokenException exception) {
            log.debug("Access token validation failed [{}]: {}", exception.getErrorCode(), exception.getMessage());
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return isExpectedTokenType(claims, TokenType.REFRESH);
        } catch (JwtTokenException exception) {
            log.debug("Refresh token validation failed [{}]: {}", exception.getErrorCode(), exception.getMessage());
            return false;
        }
    }

    /**
     * 유효한 토큰의 Claims를 반환한다.
     * 호출 전 {@link #validateToken(String)} 등으로 검증했거나, 예외 전파를 허용하는 경우에 사용한다.
     */
    public Claims getClaims(String token) {
        return parseClaims(token);
    }

    /**
     * 유효한 토큰에서 사용자 ID(sub)를 반환한다.
     */
    public Long getUserId(String token) {
        Claims claims = parseClaims(token);
        return parseUserId(claims.getSubject());
    }

    /**
     * 유효한 토큰의 만료 여부를 반환한다.
     */
    public boolean isExpired(String token) {
        Claims claims = parseClaims(token);
        return claims.getExpiration().before(new Date());
    }

    private String createToken(Long userId, TokenType tokenType, Duration expiration) {
        long expirationMillis = expiration.toMillis();
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .issuer(JwtConstants.ISSUER)
                .subject(String.valueOf(userId))
                .claim(JwtConstants.CLAIM_TOKEN_TYPE, tokenType.name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    private boolean isExpectedTokenType(Claims claims, TokenType expectedType) {
        String tokenType = claims.get(JwtConstants.CLAIM_TOKEN_TYPE, String.class);
        return expectedType.name().equals(tokenType);
    }

    /**
     * JWT 파싱 공통 메서드.
     * 파싱 실패 시 {@link JwtTokenException}을 발생시킨다.
     */
    private Claims parseClaims(String token) {
        if (!StringUtils.hasText(token)) {
            throw new JwtTokenException(JwtErrorCode.INVALID);
        }

        try {
            return Jwts.parser()
                    .requireIssuer(JwtConstants.ISSUER)
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException exception) {
            throw new JwtTokenException(JwtErrorCode.EXPIRED, exception);
        } catch (UnsupportedJwtException exception) {
            throw new JwtTokenException(JwtErrorCode.UNSUPPORTED, exception);
        } catch (MalformedJwtException exception) {
            throw new JwtTokenException(JwtErrorCode.MALFORMED, exception);
        } catch (JwtException exception) {
            throw new JwtTokenException(JwtErrorCode.INVALID, exception);
        } catch (IllegalArgumentException exception) {
            throw new JwtTokenException(JwtErrorCode.INVALID, exception);
        }
    }

    private Long parseUserId(String subject) {
        try {
            return Long.parseLong(subject);
        } catch (NumberFormatException exception) {
            throw new JwtTokenException(JwtErrorCode.INVALID, exception);
        }
    }
}
