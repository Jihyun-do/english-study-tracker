package com.jude.englishstudy.auth.oauth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Map;

/**
 * Google OAuth2 사용자 정보를 조회한다.
 * DB 저장은 하지 않으며, {@link OAuth2UserInfoConverter}로 UserInfo 변환이 가능하도록 attribute를 검증한다.
 */
@Service
@Slf4j
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate;

    public CustomOAuth2UserService() {
        this(new DefaultOAuth2UserService());
    }

    CustomOAuth2UserService(OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate) {
        this.delegate = delegate;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = delegate.loadUser(userRequest);
        validateRequiredAttributes(oauth2User.getAttributes());
        return oauth2User;
    }

    private void validateRequiredAttributes(Map<String, Object> attributes) {
        validateAttribute(attributes, GoogleOAuth2Attributes.SUB);
        validateAttribute(attributes, GoogleOAuth2Attributes.EMAIL);
    }

    private void validateAttribute(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        if (!(value instanceof String text) || !StringUtils.hasText(text)) {
            log.warn("Google OAuth2 userinfo is missing required attribute: {}", key);
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_user_info"),
                    "Required Google user info is missing: " + key
            );
        }
    }
}
