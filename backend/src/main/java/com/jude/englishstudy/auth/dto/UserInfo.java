package com.jude.englishstudy.auth.dto;

/**
 * Google OAuth 로그인 성공 후 전달되는 사용자 정보.
 */
public record UserInfo(
        String googleId,
        String email,
        String nickname,
        String profileImageUrl,
        String deviceId,
        String deviceName
) {
}
