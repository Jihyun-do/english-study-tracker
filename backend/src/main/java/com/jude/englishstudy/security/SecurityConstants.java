package com.jude.englishstudy.security;

/**
 * Spring Security 공통 상수.
 * 공개 URL, 필터 순서 등 인증 관련 설정을 한곳에서 관리한다.
 */
public final class SecurityConstants {

    /**
     * 인증 없이 접근 가능한 URL.
     * JWT Filter / OAuth2 Login 적용 후에도 유지되어야 하는 경로만 등록한다.
     */
    public static final String[] PUBLIC_URLS = {
            "/api/health",
            "/actuator/**",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    };

    private SecurityConstants() {
    }
}
