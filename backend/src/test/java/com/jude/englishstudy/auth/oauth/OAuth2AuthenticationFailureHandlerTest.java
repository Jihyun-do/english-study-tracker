package com.jude.englishstudy.auth.oauth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jude.englishstudy.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

import static org.assertj.core.api.Assertions.assertThat;

class OAuth2AuthenticationFailureHandlerTest {

    private OAuth2AuthenticationFailureHandler failureHandler;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        failureHandler = new OAuth2AuthenticationFailureHandler(
                new OAuth2LoginResponseWriter(objectMapper)
        );
    }

    @Test
    @DisplayName("OAuth2 로그인 실패 시 공통 JSON 에러 응답을 반환한다")
    void onAuthenticationFailure() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException exception = new OAuth2AuthenticationException(
                new OAuth2Error("invalid_token"),
                "Token is invalid"
        );

        failureHandler.onAuthenticationFailure(request, response, exception);

        assertThat(response.getStatus()).isEqualTo(ErrorCode.UNAUTHORIZED.getHttpStatus().value());

        JsonNode json = objectMapper.readTree(response.getContentAsString());
        assertThat(json.get("code").asText()).isEqualTo(ErrorCode.UNAUTHORIZED.name());
        assertThat(json.get("message").asText()).isEqualTo("Google login failed");
    }
}
