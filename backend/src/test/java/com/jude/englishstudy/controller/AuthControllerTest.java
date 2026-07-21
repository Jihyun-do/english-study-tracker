package com.jude.englishstudy.controller;

import com.jude.englishstudy.auth.dto.AuthStatus;
import com.jude.englishstudy.auth.dto.MeResponse;
import com.jude.englishstudy.auth.service.AuthService;
import com.jude.englishstudy.common.ApiResponse;
import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;
import com.jude.englishstudy.security.principal.CustomUserPrincipal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    @DisplayName("GET /api/auth/me는 Service를 호출하여 현재 사용자 정보를 반환한다")
    void getMe() {
        User user = mock(User.class);
        StudyMember studyMember = mock(StudyMember.class);
        when(user.getId()).thenReturn(1L);
        when(user.getEmail()).thenReturn("user@example.com");
        when(user.getNickname()).thenReturn("jude");
        when(studyMember.getRole()).thenReturn("ADMIN");

        CustomUserPrincipal principal = CustomUserPrincipal.from(user, studyMember);
        MeResponse meResponse = new MeResponse(
                AuthStatus.REGISTERED,
                1L,
                "user@example.com",
                "jude",
                "https://example.com/profile.png",
                10L,
                "ADMIN"
        );

        when(authService.getMe(1L)).thenReturn(meResponse);

        ApiResponse<MeResponse> response = authController.getMe(principal);

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).isEqualTo(meResponse);
    }
}
