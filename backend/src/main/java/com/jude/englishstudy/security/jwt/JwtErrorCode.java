package com.jude.englishstudy.security.jwt;

import lombok.Getter;

/**
 * JWT 처리 중 발생하는 오류 유형.
 */
@Getter
public enum JwtErrorCode {

    INVALID("유효하지 않은 토큰입니다."),
    EXPIRED("만료된 토큰입니다."),
    UNSUPPORTED("지원하지 않는 토큰입니다."),
    MALFORMED("잘못된 형식의 토큰입니다."),
    INVALID_TYPE("토큰 유형이 올바르지 않습니다.");

    private final String message;

    JwtErrorCode(String message) {
        this.message = message;
    }
}
