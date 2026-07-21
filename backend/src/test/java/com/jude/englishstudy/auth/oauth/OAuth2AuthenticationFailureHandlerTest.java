package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.config.AppProperties;
import com.jude.englishstudy.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

import static org.assertj.core.api.Assertions.assertThat;

class OAuth2AuthenticationFailureHandlerTest {

    private OAuth2AuthenticationFailureHandler failureHandler;

    @BeforeEach
    void setUp() {
        AppProperties appProperties = new AppProperties();
        appProperties.setFrontendUrl("http://localhost:5173");

        failureHandler = new OAuth2AuthenticationFailureHandler(
                new OAuth2LoginResponseWriter(appProperties)
        );
    }

    @Test
    @DisplayName("OAuth2 로그인 실패 시 프론트 callback으로 Redirect한다")
    void onAuthenticationFailure() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        OAuth2AuthenticationException exception = new OAuth2AuthenticationException(
                new OAuth2Error("invalid_token"),
                "Token is invalid"
        );

        failureHandler.onAuthenticationFailure(request, response, exception);

        assertThat(response.getStatus()).isEqualTo(302);
        assertThat(response.getRedirectedUrl())
                .startsWith("http://localhost:5173/auth/callback")
                .contains("error=" + ErrorCode.UNAUTHORIZED.name());
    }
}
