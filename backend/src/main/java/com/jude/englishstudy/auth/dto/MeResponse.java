package com.jude.englishstudy.auth.dto;

import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;

/**
 * GET /api/auth/me 응답.
 */
public record MeResponse(
        AuthStatus status,
        Long userId,
        String email,
        String nickname,
        String profileImage,
        Long studyId,
        String role
) {

    public static MeResponse registered(User user, StudyMember studyMember) {
        return new MeResponse(
                AuthStatus.REGISTERED,
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                studyMember.getStudyId(),
                studyMember.getRole()
        );
    }

    public static MeResponse onboarding(User user) {
        return new MeResponse(
                AuthStatus.ONBOARDING,
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                null,
                null
        );
    }
}
