package com.jude.englishstudy.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jude.englishstudy.exception.ErrorCode;
import com.jude.englishstudy.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Security 계층 JSON 에러 응답 작성.
 * EntryPoint / AccessDeniedHandler에서 공통 사용한다.
 */
@Component
@RequiredArgsConstructor
public class SecurityErrorResponseWriter {

    private final ObjectMapper objectMapper;

    public void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        write(response, ErrorCode.UNAUTHORIZED, message);
    }

    public void writeForbidden(HttpServletResponse response, String message) throws IOException {
        write(response, ErrorCode.FORBIDDEN, message);
    }

    private void write(HttpServletResponse response, ErrorCode errorCode, String message) throws IOException {
        ErrorResponse errorResponse = ErrorResponse.of(errorCode, message);

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
