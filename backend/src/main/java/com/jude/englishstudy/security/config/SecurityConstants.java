package com.jude.englishstudy.security.config;

/**
 * Spring Security 공통 상수.
 */
public final class SecurityConstants {

    /**
     * 인증 없이 접근 가능한 URL.
     */
    public static final String[] PUBLIC_URLS = {
            "/api/health",
            "/actuator/**",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/oauth2/**",
            "/login/oauth2/**"
    };

    private SecurityConstants() {
    }
}
