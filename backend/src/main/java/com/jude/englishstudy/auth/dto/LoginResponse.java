package com.jude.englishstudy.auth.dto;

import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;

/**
 * Google 로그인 성공 응답.
 */
public record LoginResponse(
        String accessToken,
        String refreshToken,
        Long userId,
        String email,
        String nickname,
        String profileImageUrl,
        String role
) {

    public static LoginResponse of(
            User user,
            StudyMember studyMember,
            String accessToken,
            String refreshToken) {
        return new LoginResponse(
                accessToken,
                refreshToken,
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                studyMember.getRole()
        );
    }
}
