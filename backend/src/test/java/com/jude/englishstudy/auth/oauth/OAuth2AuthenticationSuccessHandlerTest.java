package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.auth.dto.AuthStatus;
import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.auth.dto.UserInfo;
import com.jude.englishstudy.auth.service.AuthService;
import com.jude.englishstudy.config.AppProperties;
import com.jude.englishstudy.exception.BusinessException;
import com.jude.englishstudy.exception.ErrorCode;
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

    @BeforeEach
    void setUp() {
        AppProperties appProperties = new AppProperties();
        appProperties.setFrontendUrl("http://localhost:5173");

        successHandler = new OAuth2AuthenticationSuccessHandler(
                authService,
                deviceInfoResolver,
                new OAuth2LoginResponseWriter(appProperties)
        );
    }

    @Test
    @DisplayName("OAuth2 로그인 성공 시 프론트 callback으로 Redirect한다")
    void onAuthenticationSuccess() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        Authentication authentication = mock(Authentication.class);
        OAuth2User oauth2User = createOAuth2User();
        LoginResponse loginResponse = LoginResponse.registered(
                mockUser(),
                mockStudyMember(),
                "access.token",
                "refresh.token"
        );

        when(authentication.getPrincipal()).thenReturn(oauth2User);
        when(deviceInfoResolver.resolve(request)).thenReturn(new DeviceInfo("device-1", "Chrome"));
        when(authService.login(any(UserInfo.class))).thenReturn(loginResponse);

        successHandler.onAuthenticationSuccess(request, response, authentication);

        assertThat(response.getStatus()).isEqualTo(302);
        assertThat(response.getRedirectedUrl())
                .startsWith("http://localhost:5173/auth/callback")
                .contains("accessToken=access.token")
                .contains("refreshToken=refresh.token")
                .contains("status=registered");

        verify(authService).login(any(UserInfo.class));
    }

    @Test
    @DisplayName("StudyMember가 없으면 onboarding callback으로 Redirect한다")
    void onAuthenticationSuccessOnboarding() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        Authentication authentication = mock(Authentication.class);
        OAuth2User oauth2User = createOAuth2User();
        LoginResponse loginResponse = LoginResponse.onboarding(
                mockUser(),
                "access.token",
                "refresh.token"
        );

        when(authentication.getPrincipal()).thenReturn(oauth2User);
        when(deviceInfoResolver.resolve(request)).thenReturn(new DeviceInfo("device-1", "Chrome"));
        when(authService.login(any(UserInfo.class))).thenReturn(loginResponse);

        successHandler.onAuthenticationSuccess(request, response, authentication);

        assertThat(response.getStatus()).isEqualTo(302);
        assertThat(response.getRedirectedUrl())
                .startsWith("http://localhost:5173/auth/callback")
                .contains("status=onboarding")
                .contains("accessToken=access.token")
                .contains("email=")
                .contains("nickname=jude");
    }

    @Test
    @DisplayName("AuthService 예외 발생 시 error callback으로 Redirect한다")
    void onAuthenticationSuccessBusinessException() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        Authentication authentication = mock(Authentication.class);
        OAuth2User oauth2User = createOAuth2User();

        when(authentication.getPrincipal()).thenReturn(oauth2User);
        when(deviceInfoResolver.resolve(request)).thenReturn(new DeviceInfo("device-1", "Chrome"));
        when(authService.login(any(UserInfo.class)))
                .thenThrow(new BusinessException(ErrorCode.UNAUTHORIZED, "Google account mismatch"));

        successHandler.onAuthenticationSuccess(request, response, authentication);

        assertThat(response.getStatus()).isEqualTo(302);
        assertThat(response.getRedirectedUrl())
                .contains("error=" + ErrorCode.UNAUTHORIZED.name());
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

    private com.jude.englishstudy.domain.entity.User mockUser() {
        com.jude.englishstudy.domain.entity.User user = mock(com.jude.englishstudy.domain.entity.User.class);
        when(user.getId()).thenReturn(1L);
        when(user.getEmail()).thenReturn("user@example.com");
        when(user.getNickname()).thenReturn("jude");
        when(user.getProfileImageUrl()).thenReturn("https://example.com/profile.png");
        return user;
    }

    private com.jude.englishstudy.domain.entity.StudyMember mockStudyMember() {
        com.jude.englishstudy.domain.entity.StudyMember studyMember =
                mock(com.jude.englishstudy.domain.entity.StudyMember.class);
        when(studyMember.getStudyId()).thenReturn(10L);
        when(studyMember.getRole()).thenReturn("ADMIN");
        return studyMember;
    }
}
