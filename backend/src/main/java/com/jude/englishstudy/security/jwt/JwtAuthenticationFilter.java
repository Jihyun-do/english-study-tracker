package com.jude.englishstudy.security.jwt;

import com.jude.englishstudy.security.config.PublicPathMatcher;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Authorization Header의 Bearer Access Token을 파싱하는 필터.
 *
 * <p>인증 객체 생성은 추후 {@code JwtAuthenticationService} 등으로 위임할 수 있다.
 * UserDetailsService 구현 후 SecurityConfig에 등록한다.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final PublicPathMatcher publicPathMatcher;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        // SecurityConfig PUBLIC_URLS와 동일한 정책 — JWT 검증 불필요 경로 제외
        return publicPathMatcher.matchesPublicPath(request);
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = extractAccessToken(request);
        if (StringUtils.hasText(token)) {
            authenticate(token);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Access Token Claims 파싱 후 Authentication 설정.
     * 실제 User 조회·Principal 생성은 추후 서비스 계층으로 위임한다.
     */
    private void authenticate(String token) {
        try {
            Claims claims = jwtTokenProvider.getClaims(token);
            validateAccessTokenType(claims);

            // TODO: 1. JWT에서 userId 추출
            // Long userId = jwtTokenProvider.getUserId(token);

            // TODO: 2. User 조회
            // TODO: 3. StudyMember 조회 (MVP: 사용자당 1개 스터디)
            // TODO: 4. CustomUserPrincipal 생성
            // CustomUserPrincipal principal = CustomUserPrincipal.from(user, studyMember);

            // TODO: 5. UsernamePasswordAuthenticationToken 생성
            // UsernamePasswordAuthenticationToken authentication =
            //         new UsernamePasswordAuthenticationToken(principal, token, principal.getAuthorities());

            // TODO: 6. SecurityContextHolder에 Authentication 저장
            // SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (JwtTokenException exception) {
            log.debug("JWT authentication skipped [{}]: {}", exception.getErrorCode(), exception.getMessage());
        }
    }

    private void validateAccessTokenType(Claims claims) {
        String tokenType = claims.get(JwtConstants.CLAIM_TOKEN_TYPE, String.class);
        if (!TokenType.ACCESS.name().equals(tokenType)) {
            throw new JwtTokenException(JwtErrorCode.INVALID_TYPE);
        }
    }

    private String extractAccessToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(JwtConstants.AUTHORIZATION_HEADER);

        if (!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith(JwtConstants.BEARER_PREFIX)) {
            return null;
        }

        return authorizationHeader.substring(JwtConstants.BEARER_PREFIX.length()).trim();
    }
}
