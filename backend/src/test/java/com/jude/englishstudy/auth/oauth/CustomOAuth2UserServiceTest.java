package com.jude.englishstudy.auth.oauth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate;

    private CustomOAuth2UserService customOAuth2UserService;

    @BeforeEach
    void setUp() {
        customOAuth2UserService = new CustomOAuth2UserService(delegate);
    }

    @Test
    @DisplayName("Google 사용자 정보를 조회하고 필수 attribute를 검증한다")
    void loadUser() {
        OAuth2UserRequest userRequest = mock(OAuth2UserRequest.class);
        OAuth2User oauth2User = new DefaultOAuth2User(
                null,
                Map.of(
                        GoogleOAuth2Attributes.SUB, "google-sub-1",
                        GoogleOAuth2Attributes.EMAIL, "user@example.com"
                ),
                GoogleOAuth2Attributes.SUB
        );

        when(delegate.loadUser(userRequest)).thenReturn(oauth2User);

        OAuth2User loadedUser = customOAuth2UserService.loadUser(userRequest);

        assertThat(loadedUser.getAttributes())
                .containsEntry(GoogleOAuth2Attributes.SUB, "google-sub-1")
                .containsEntry(GoogleOAuth2Attributes.EMAIL, "user@example.com");
    }

    @Test
    @DisplayName("필수 attribute가 없으면 OAuth2AuthenticationException을 발생시킨다")
    void loadUserMissingEmail() {
        OAuth2UserRequest userRequest = mock(OAuth2UserRequest.class);
        OAuth2User oauth2User = new DefaultOAuth2User(
                null,
                Map.of(GoogleOAuth2Attributes.SUB, "google-sub-1"),
                GoogleOAuth2Attributes.SUB
        );

        when(delegate.loadUser(userRequest)).thenReturn(oauth2User);

        assertThatThrownBy(() -> customOAuth2UserService.loadUser(userRequest))
                .isInstanceOf(OAuth2AuthenticationException.class)
                .hasMessageContaining(GoogleOAuth2Attributes.EMAIL);
    }
}
