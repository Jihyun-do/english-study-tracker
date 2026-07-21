package com.jude.englishstudy.controller;

import com.jude.englishstudy.auth.dto.MeResponse;
import com.jude.englishstudy.auth.dto.OnboardingRequest;
import com.jude.englishstudy.auth.service.AuthService;
import com.jude.englishstudy.common.ApiResponse;
import com.jude.englishstudy.security.principal.CustomUserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/me")
    public ApiResponse<MeResponse> getMe(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ApiResponse.ok(authService.getMe(principal.getUserId()));
    }

    @PostMapping("/onboarding")
    public ApiResponse<MeResponse> completeOnboarding(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody OnboardingRequest request) {
        return ApiResponse.ok(authService.completeOnboarding(
                principal.getUserId(),
                request.inviteCode(),
                request.nickname()
        ));
    }
}
