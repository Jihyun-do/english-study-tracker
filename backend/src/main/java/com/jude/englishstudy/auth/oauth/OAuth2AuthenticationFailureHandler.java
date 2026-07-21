package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Google OAuth2 로그인 실패 시 프론트엔드 로그인 화면으로 Redirect한다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final OAuth2LoginResponseWriter oAuth2LoginResponseWriter;

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException {

        log.warn("Google OAuth2 login failed: {}", exception.getMessage());
        oAuth2LoginResponseWriter.redirectError(
                response,
                ErrorCode.UNAUTHORIZED,
                "Google login failed"
        );
    }
}
