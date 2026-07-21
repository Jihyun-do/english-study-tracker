package com.jude.englishstudy.auth.service;

import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.auth.dto.MeResponse;
import com.jude.englishstudy.auth.dto.UserInfo;
import com.jude.englishstudy.domain.entity.RefreshToken;
import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;
import com.jude.englishstudy.domain.repository.RefreshTokenRepository;
import com.jude.englishstudy.domain.repository.StudyMemberRepository;
import com.jude.englishstudy.domain.repository.StudyRepository;
import com.jude.englishstudy.domain.repository.UserRepository;
import com.jude.englishstudy.exception.BusinessException;
import com.jude.englishstudy.exception.ErrorCode;
import com.jude.englishstudy.security.jwt.JwtProperties;
import com.jude.englishstudy.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudyMemberRepository studyMemberRepository;

    @Mock
    private StudyRepository studyRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    private JwtProperties jwtProperties;

    private AuthService authService;

    private UserInfo userInfo;

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties();
        jwtProperties.setSecret("test-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm");
        jwtProperties.setAccessTokenExpiration(Duration.ofHours(1));
        jwtProperties.setRefreshTokenExpiration(Duration.ofDays(14));

        authService = new AuthService(
                userRepository,
                studyMemberRepository,
                studyRepository,
                refreshTokenRepository,
                jwtTokenProvider,
                jwtProperties
        );

        userInfo = new UserInfo(
                "google-sub-1",
                "user@example.com",
                "jude",
                "https://example.com/profile.png",
                "device-1",
                "Chrome on Windows"
        );
    }

    @Test
    @DisplayName("기존 사용자 로그인 시 토큰을 발급하고 RefreshToken을 저장한다")
    void loginExistingUser() {
        User user = mockUser(1L);
        StudyMember studyMember = mockStudyMember("ADMIN");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.of(studyMember));
        when(refreshTokenRepository.findByUserIdAndDeviceId(1L, "device-1")).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.createAccessToken(1L)).thenReturn("access.token");
        when(jwtTokenProvider.createRefreshToken(1L)).thenReturn("refresh.token");

        LoginResponse response = authService.login(userInfo);

        assertThat(response.userId()).isEqualTo(1L);
        assertThat(response.email()).isEqualTo("user@example.com");
        assertThat(response.nickname()).isEqualTo("jude");
        assertThat(response.role()).isEqualTo("ADMIN");
        assertThat(response.status()).isEqualTo(com.jude.englishstudy.auth.dto.AuthStatus.REGISTERED);
        assertThat(response.accessToken()).isEqualTo("access.token");
        assertThat(response.refreshToken()).isEqualTo("refresh.token");

        verify(user).updateLoginInfo(eq("jude"), eq("https://example.com/profile.png"), any(LocalDateTime.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("신규 사용자는 User를 생성한 뒤 로그인한다")
    void loginNewUser() {
        StudyMember studyMember = mockStudyMember("MEMBER");
        User persistedUser = mock(User.class);
        when(persistedUser.getId()).thenReturn(2L);
        when(persistedUser.getEmail()).thenReturn("user@example.com");
        when(persistedUser.getNickname()).thenReturn("jude");
        when(persistedUser.getProfileImageUrl()).thenReturn("https://example.com/profile.png");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User createdUser = invocation.getArgument(0);
            assertThat(createdUser.getGoogleId()).isEqualTo("google-sub-1");
            assertThat(createdUser.getEmail()).isEqualTo("user@example.com");
            assertThat(createdUser.getStatus()).isEqualTo("ACTIVE");
            return persistedUser;
        });
        when(studyMemberRepository.findByUserId(2L)).thenReturn(Optional.of(studyMember));
        when(refreshTokenRepository.findByUserIdAndDeviceId(2L, "device-1")).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.createAccessToken(2L)).thenReturn("access.token");
        when(jwtTokenProvider.createRefreshToken(2L)).thenReturn("refresh.token");

        LoginResponse response = authService.login(userInfo);

        assertThat(response.userId()).isEqualTo(2L);
        assertThat(response.role()).isEqualTo("MEMBER");

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("StudyMember가 없으면 ONBOARDING 상태로 JWT를 발급한다")
    void loginWithoutStudyMember() {
        User user = mockUser(1L);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(refreshTokenRepository.findByUserIdAndDeviceId(1L, "device-1")).thenReturn(Optional.empty());
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.createAccessToken(1L)).thenReturn("access.token");
        when(jwtTokenProvider.createRefreshToken(1L)).thenReturn("refresh.token");

        LoginResponse response = authService.login(userInfo);

        assertThat(response.status()).isEqualTo(com.jude.englishstudy.auth.dto.AuthStatus.ONBOARDING);
        assertThat(response.accessToken()).isEqualTo("access.token");
        assertThat(response.refreshToken()).isEqualTo("refresh.token");
        assertThat(response.role()).isNull();
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("같은 deviceId로 재로그인하면 RefreshToken을 갱신한다")
    void loginRotatesRefreshTokenOnSameDevice() {
        User user = mockUser(1L);
        StudyMember studyMember = mockStudyMember("MEMBER");
        RefreshToken existingToken = mock(RefreshToken.class);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.of(studyMember));
        when(refreshTokenRepository.findByUserIdAndDeviceId(1L, "device-1")).thenReturn(Optional.of(existingToken));
        when(jwtTokenProvider.createAccessToken(1L)).thenReturn("access.token");
        when(jwtTokenProvider.createRefreshToken(1L)).thenReturn("refresh.token");

        authService.login(userInfo);

        verify(existingToken).rotate(any(), any(), any());
        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    @DisplayName("googleId가 일치하지 않으면 UNAUTHORIZED 예외를 발생시킨다")
    void loginGoogleIdMismatch() {
        User user = mock(User.class);
        when(user.getGoogleId()).thenReturn("other-google-id");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(userInfo))
                .isInstanceOf(BusinessException.class)
                .satisfies(exception -> {
                    BusinessException businessException = (BusinessException) exception;
                    assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.UNAUTHORIZED);
                });
    }

    @Test
    @DisplayName("userId로 현재 사용자 정보를 반환한다")
    void getMe() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(user.getEmail()).thenReturn("user@example.com");
        when(user.getNickname()).thenReturn("jude");
        when(user.getProfileImageUrl()).thenReturn("https://example.com/profile.png");

        StudyMember studyMember = mock(StudyMember.class);
        when(studyMember.getStudyId()).thenReturn(10L);
        when(studyMember.getRole()).thenReturn("ADMIN");
        when(studyMember.getStatus()).thenReturn("ACTIVE");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.of(studyMember));

        MeResponse response = authService.getMe(1L);

        assertThat(response.userId()).isEqualTo(1L);
        assertThat(response.email()).isEqualTo("user@example.com");
        assertThat(response.nickname()).isEqualTo("jude");
        assertThat(response.profileImage()).isEqualTo("https://example.com/profile.png");
        assertThat(response.studyId()).isEqualTo(10L);
        assertThat(response.role()).isEqualTo("ADMIN");
        assertThat(response.status()).isEqualTo(com.jude.englishstudy.auth.dto.AuthStatus.REGISTERED);
    }

    @Test
    @DisplayName("getMe에서 StudyMember가 없으면 ONBOARDING 상태를 반환한다")
    void getMeOnboarding() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(user.getEmail()).thenReturn("user@example.com");
        when(user.getNickname()).thenReturn("jude");
        when(user.getProfileImageUrl()).thenReturn("https://example.com/profile.png");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.empty());

        MeResponse response = authService.getMe(1L);

        assertThat(response.status()).isEqualTo(com.jude.englishstudy.auth.dto.AuthStatus.ONBOARDING);
        assertThat(response.role()).isNull();
        assertThat(response.studyId()).isNull();
    }

    @Test
    @DisplayName("getMe에서 User가 없으면 NOT_FOUND 예외를 발생시킨다")
    void getMeUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.getMe(99L))
                .isInstanceOf(BusinessException.class)
                .satisfies(exception -> {
                    BusinessException businessException = (BusinessException) exception;
                    assertThat(businessException.getErrorCode()).isEqualTo(ErrorCode.NOT_FOUND);
                });
    }

    private User mockUser(Long userId) {
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);
        when(user.getGoogleId()).thenReturn("google-sub-1");
        when(user.getEmail()).thenReturn("user@example.com");
        when(user.getNickname()).thenReturn("jude");
        when(user.getProfileImageUrl()).thenReturn("https://example.com/profile.png");
        return user;
    }

    private StudyMember mockStudyMember(String role) {
        StudyMember studyMember = mock(StudyMember.class);
        when(studyMember.getRole()).thenReturn(role);
        when(studyMember.getStatus()).thenReturn("ACTIVE");
        return studyMember;
    }

    private StudyMember mockStudyMemberWithStudyId(String role, Long studyId) {
        StudyMember studyMember = mockStudyMember(role);
        when(studyMember.getStudyId()).thenReturn(studyId);
        return studyMember;
    }
}
