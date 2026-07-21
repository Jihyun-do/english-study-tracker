package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.auth.dto.UserInfo;
import com.jude.englishstudy.auth.service.AuthService;
import com.jude.englishstudy.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Google OAuth2 로그인 성공 시 AuthService로 JWT를 발급하고 프론트엔드로 Redirect한다.
 */
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final DeviceInfoResolver deviceInfoResolver;
    private final OAuth2LoginResponseWriter oAuth2LoginResponseWriter;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        DeviceInfo deviceInfo = deviceInfoResolver.resolve(request);

        try {
            UserInfo userInfo = OAuth2UserInfoConverter.toUserInfo(
                    oauth2User,
                    deviceInfo.deviceId(),
                    deviceInfo.deviceName()
            );
            LoginResponse loginResponse = authService.login(userInfo);
            oAuth2LoginResponseWriter.redirectSuccess(response, loginResponse);
        } catch (BusinessException exception) {
            oAuth2LoginResponseWriter.redirectError(
                    response,
                    exception.getErrorCode(),
                    exception.getMessage()
            );
        }
    }
}
