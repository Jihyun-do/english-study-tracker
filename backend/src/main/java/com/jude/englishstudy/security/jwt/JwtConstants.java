package com.jude.englishstudy.security.jwt;

/**
 * JWT 관련 상수.
 */
public final class JwtConstants {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String CLAIM_TOKEN_TYPE = "type";
    public static final String ISSUER = "english-study";

    private JwtConstants() {
    }
}
