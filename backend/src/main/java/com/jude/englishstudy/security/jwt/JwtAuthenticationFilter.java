package com.jude.englishstudy.security.jwt;

import com.jude.englishstudy.security.config.PublicPathMatcher;
import com.jude.englishstudy.security.principal.CustomUserPrincipal;
import com.jude.englishstudy.security.service.CustomUserDetailsService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Authorization Header의 Bearer Access Token을 검증하고 SecurityContext에 Authentication을 설정한다.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final PublicPathMatcher publicPathMatcher;
    private final CustomUserDetailsService customUserDetailsService;
    private final WebAuthenticationDetailsSource authenticationDetailsSource = new WebAuthenticationDetailsSource();

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
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
            authenticate(token, request);
        }

        filterChain.doFilter(request, response);
    }

    private void authenticate(String token, HttpServletRequest request) {
        Claims claims = jwtTokenProvider.getClaims(token);
        validateAccessTokenType(claims);

        Long userId = jwtTokenProvider.getUserId(token);
        CustomUserPrincipal principal = (CustomUserPrincipal) customUserDetailsService.loadUserById(userId);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        authentication.setDetails(authenticationDetailsSource.buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
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
