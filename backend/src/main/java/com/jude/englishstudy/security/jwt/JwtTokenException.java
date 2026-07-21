package com.jude.englishstudy.security.jwt;

import lombok.Getter;

/**
 * JWT 처리 중 발생하는 예외.
 * JwtTokenProvider 내부에서 일관되게 사용한다.
 */
@Getter
public class JwtTokenException extends RuntimeException {

    private final JwtErrorCode errorCode;

    public JwtTokenException(JwtErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public JwtTokenException(JwtErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }
}
