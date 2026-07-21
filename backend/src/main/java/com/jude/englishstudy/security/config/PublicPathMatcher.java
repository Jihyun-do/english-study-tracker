package com.jude.englishstudy.security.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;

/**
 * SecurityConfig의 PUBLIC_URLS와 동일한 경로 매칭 정책을 제공한다.
 * JwtAuthenticationFilter.shouldNotFilter() 등에서 재사용한다.
 */
@Component
public class PublicPathMatcher {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    /**
     * 요청 경로가 PUBLIC_URLS에 해당하는지 확인한다.
     */
    public boolean matchesPublicPath(HttpServletRequest request) {
        String requestPath = resolveRequestPath(request);

        for (String pattern : SecurityConstants.PUBLIC_URLS) {
            if (pathMatcher.match(pattern, requestPath)) {
                return true;
            }
        }

        return false;
    }

    private String resolveRequestPath(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String contextPath = request.getContextPath();

        if (StringUtils.hasText(contextPath) && requestUri.startsWith(contextPath)) {
            return requestUri.substring(contextPath.length());
        }

        return requestUri;
    }
}
