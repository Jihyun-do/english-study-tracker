package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.auth.dto.UserInfo;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.StringUtils;

import java.util.Map;

/**
 * Google OAuth2User attribute를 UserInfo DTO로 변환한다.
 */
public final class OAuth2UserInfoConverter {

    private OAuth2UserInfoConverter() {
    }

    public static UserInfo toUserInfo(OAuth2User oauth2User, String deviceId, String deviceName) {
        Map<String, Object> attributes = oauth2User.getAttributes();

        return new UserInfo(
                getRequiredAttribute(attributes, GoogleOAuth2Attributes.SUB),
                getRequiredAttribute(attributes, GoogleOAuth2Attributes.EMAIL),
                resolveNickname(attributes),
                (String) attributes.get(GoogleOAuth2Attributes.PICTURE),
                deviceId,
                deviceName
        );
    }

    private static String resolveNickname(Map<String, Object> attributes) {
        String name = (String) attributes.get(GoogleOAuth2Attributes.NAME);
        if (StringUtils.hasText(name)) {
            return name;
        }

        return getRequiredAttribute(attributes, GoogleOAuth2Attributes.EMAIL);
    }

    private static String getRequiredAttribute(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        if (value instanceof String text && StringUtils.hasText(text)) {
            return text;
        }

        throw new IllegalArgumentException("Required Google OAuth2 attribute is missing: " + key);
    }
}
