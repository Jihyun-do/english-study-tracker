package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.auth.dto.AuthStatus;
import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.config.AppProperties;
import com.jude.englishstudy.exception.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * OAuth2 로그인 성공/실패 후 프론트엔드 Redirect 응답 작성.
 */
@Component
@RequiredArgsConstructor
public class OAuth2LoginResponseWriter {

    private static final String CALLBACK_PATH = "/auth/callback";

    private final AppProperties appProperties;

    public void redirectSuccess(HttpServletResponse response, LoginResponse loginResponse) throws IOException {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(appProperties.getFrontendUrl() + CALLBACK_PATH)
                .queryParam("accessToken", loginResponse.accessToken())
                .queryParam("refreshToken", loginResponse.refreshToken())
                .queryParam("status", loginResponse.status().name().toLowerCase());

        if (loginResponse.status() == AuthStatus.ONBOARDING) {
            builder.queryParam("email", loginResponse.email())
                    .queryParam("nickname", loginResponse.nickname());
        }

        response.sendRedirect(builder.encode(StandardCharsets.UTF_8).build().toUriString());
    }

    public void redirectOnboarding(
            HttpServletResponse response,
            String email,
            String nickname) throws IOException {
        String redirectUrl = UriComponentsBuilder
                .fromUriString(appProperties.getFrontendUrl() + CALLBACK_PATH)
                .queryParam("status", "onboarding")
                .queryParam("email", email)
                .queryParam("nickname", nickname)
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    public void redirectError(
            HttpServletResponse response,
            ErrorCode errorCode,
            String message) throws IOException {
        String redirectUrl = UriComponentsBuilder
                .fromUriString(appProperties.getFrontendUrl() + CALLBACK_PATH)
                .queryParam("error", errorCode.name())
                .queryParam("message", message)
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
