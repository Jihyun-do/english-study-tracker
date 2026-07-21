package com.jude.englishstudy.auth.oauth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.auth.dto.UserInfo;
import com.jude.englishstudy.auth.service.AuthService;
import com.jude.englishstudy.exception.BusinessException;
import com.jude.englishstudy.exception.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OAuth2AuthenticationSuccessHandlerTest {

    @Mock
    private AuthService authService;

    @Mock
    private DeviceInfoResolver deviceInfoResolver;

    private OAuth2AuthenticationSuccessHandler successHandler;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        successHandler = new OAuth2AuthenticationSuccessHandler(
                authService,
                deviceInfoResolver,
                new OAuth2LoginResponseWriter(objectMapper)
        );
    }

    @Test
    @DisplayName("OAuth2 로그인 성공 시 JWT를 포함한 JSON 응답을 반환한다")
    void onAuthenticationSuccess() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        Authentication authentication = mock(Authentication.class);
        OAuth2User oauth2User = createOAuth2User();
        LoginResponse loginResponse = new LoginResponse(
                "access.token",
                "refresh.token",
                1L,
                "user@example.com",
                "jude",
                "https://example.com/profile.png",
                "ADMIN"
        );

        when(authentication.getPrincipal()).thenReturn(oauth2User);
        when(deviceInfoResolver.resolve(request)).thenReturn(new DeviceInfo("device-1", "Chrome"));
        when(authService.login(any(UserInfo.class))).thenReturn(loginResponse);

        successHandler.onAuthenticationSuccess(request, response, authentication);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_OK);

        JsonNode json = objectMapper.readTree(response.getContentAsString());
        assertThat(json.get("success").asBoolean()).isTrue();
        assertThat(json.get("data").get("accessToken").asText()).isEqualTo("access.token");
        assertThat(json.get("data").get("refreshToken").asText()).isEqualTo("refresh.token");

        verify(authService).login(any(UserInfo.class));
    }

    @Test
    @DisplayName("AuthService 예외 발생 시 공통 에러 응답을 반환한다")
    void onAuthenticationSuccessBusinessException() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        Authentication authentication = mock(Authentication.class);
        OAuth2User oauth2User = createOAuth2User();

        when(authentication.getPrincipal()).thenReturn(oauth2User);
        when(deviceInfoResolver.resolve(request)).thenReturn(new DeviceInfo("device-1", "Chrome"));
        when(authService.login(any(UserInfo.class)))
                .thenThrow(new BusinessException(ErrorCode.FORBIDDEN, "Study membership is required to login"));

        successHandler.onAuthenticationSuccess(request, response, authentication);

        assertThat(response.getStatus()).isEqualTo(ErrorCode.FORBIDDEN.getHttpStatus().value());

        JsonNode json = objectMapper.readTree(response.getContentAsString());
        assertThat(json.get("code").asText()).isEqualTo(ErrorCode.FORBIDDEN.name());
        assertThat(json.get("message").asText()).contains("Study membership");
    }

    private OAuth2User createOAuth2User() {
        return new DefaultOAuth2User(
                null,
                Map.of(
                        GoogleOAuth2Attributes.SUB, "google-sub-1",
                        GoogleOAuth2Attributes.EMAIL, "user@example.com",
                        GoogleOAuth2Attributes.NAME, "jude",
                        GoogleOAuth2Attributes.PICTURE, "https://example.com/profile.png"
                ),
                GoogleOAuth2Attributes.SUB
        );
    }
}
