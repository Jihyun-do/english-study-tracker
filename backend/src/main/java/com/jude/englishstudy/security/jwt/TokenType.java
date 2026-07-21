package com.jude.englishstudy.security.jwt;

/**
 * JWT 토큰 유형.
 * Refresh Token DB 연동 시 Access / Refresh 검증을 구분한다.
 */
public enum TokenType {

    ACCESS,
    REFRESH
}
