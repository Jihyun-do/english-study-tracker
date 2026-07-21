package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.auth.dto.UserInfo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class OAuth2UserInfoConverterTest {

    @Test
    @DisplayName("Google OAuth2User attribute를 UserInfo로 변환한다")
    void toUserInfo() {
        OAuth2User oauth2User = createOAuth2User(Map.of(
                GoogleOAuth2Attributes.SUB, "google-sub-1",
                GoogleOAuth2Attributes.EMAIL, "user@example.com",
                GoogleOAuth2Attributes.NAME, "jude",
                GoogleOAuth2Attributes.PICTURE, "https://example.com/profile.png"
        ));

        UserInfo userInfo = OAuth2UserInfoConverter.toUserInfo(oauth2User, "device-1", "Chrome");

        assertThat(userInfo.googleId()).isEqualTo("google-sub-1");
        assertThat(userInfo.email()).isEqualTo("user@example.com");
        assertThat(userInfo.nickname()).isEqualTo("jude");
        assertThat(userInfo.profileImageUrl()).isEqualTo("https://example.com/profile.png");
        assertThat(userInfo.deviceId()).isEqualTo("device-1");
        assertThat(userInfo.deviceName()).isEqualTo("Chrome");
    }

    @Test
    @DisplayName("name이 없으면 email을 nickname으로 사용한다")
    void toUserInfoWithoutName() {
        OAuth2User oauth2User = createOAuth2User(Map.of(
                GoogleOAuth2Attributes.SUB, "google-sub-1",
                GoogleOAuth2Attributes.EMAIL, "user@example.com"
        ));

        UserInfo userInfo = OAuth2UserInfoConverter.toUserInfo(oauth2User, "device-1", "Chrome");

        assertThat(userInfo.nickname()).isEqualTo("user@example.com");
        assertThat(userInfo.profileImageUrl()).isNull();
    }

    @Test
    @DisplayName("필수 attribute가 없으면 예외를 발생시킨다")
    void toUserInfoMissingRequiredAttribute() {
        OAuth2User oauth2User = createOAuth2User(Map.of(
                GoogleOAuth2Attributes.SUB, "google-sub-1"
        ));

        assertThatThrownBy(() -> OAuth2UserInfoConverter.toUserInfo(oauth2User, "device-1", "Chrome"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining(GoogleOAuth2Attributes.EMAIL);
    }

    private OAuth2User createOAuth2User(Map<String, Object> attributes) {
        return new DefaultOAuth2User(null, attributes, GoogleOAuth2Attributes.SUB);
    }
}
