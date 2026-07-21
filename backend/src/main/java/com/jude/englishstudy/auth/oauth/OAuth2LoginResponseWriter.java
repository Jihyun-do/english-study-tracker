package com.jude.englishstudy.auth.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.common.ApiResponse;
import com.jude.englishstudy.exception.ErrorCode;
import com.jude.englishstudy.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * OAuth2 로그인 성공/실패 JSON 응답 작성.
 */
@Component
@RequiredArgsConstructor
public class OAuth2LoginResponseWriter {

    private final ObjectMapper objectMapper;

    public void writeSuccess(HttpServletResponse response, LoginResponse loginResponse) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), ApiResponse.ok(loginResponse));
    }

    public void writeError(HttpServletResponse response, ErrorCode errorCode, String message) throws IOException {
        ErrorResponse errorResponse = ErrorResponse.of(errorCode, message);

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
