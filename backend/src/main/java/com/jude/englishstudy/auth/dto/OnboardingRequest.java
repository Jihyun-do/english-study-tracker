package com.jude.englishstudy.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 온보딩(스터디 가입) 요청.
 */
public record OnboardingRequest(
        @NotBlank
        @Size(max = 50)
        String inviteCode,

        @NotBlank
        @Size(max = 50)
        String nickname
) {
}
