package com.jude.englishstudy.auth.service;

import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.auth.dto.MeResponse;
import com.jude.englishstudy.auth.dto.UserInfo;
import com.jude.englishstudy.domain.entity.RefreshToken;
import com.jude.englishstudy.domain.entity.Study;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Google OAuth 로그인, 온보딩, JWT 발급을 처리한다.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String ADMIN_INVITE_CODE = "JUDE-ADMIN";

    private final UserRepository userRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final StudyRepository studyRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;

    @Transactional
    public LoginResponse login(UserInfo userInfo) {
        User user = findOrCreateUser(userInfo);

        String accessToken = jwtTokenProvider.createAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());
        saveRefreshToken(user.getId(), refreshToken, userInfo.deviceId(), userInfo.deviceName());

        Optional<StudyMember> studyMember = findActiveStudyMember(user.getId());
        if (studyMember.isPresent()) {
            return LoginResponse.registered(user, studyMember.get(), accessToken, refreshToken);
        }

        return LoginResponse.onboarding(user, accessToken, refreshToken);
    }

    @Transactional(readOnly = true)
    public MeResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));

        return findActiveStudyMember(userId)
                .map(studyMember -> MeResponse.registered(user, studyMember))
                .orElseGet(() -> MeResponse.onboarding(user));
    }

    @Transactional
    public MeResponse completeOnboarding(Long userId, String inviteCode, String nickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));

        if (findActiveStudyMember(userId).isPresent()) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "User is already registered");
        }

        Study study = studyRepository.findByInviteCodeIgnoreCase(inviteCode.trim())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Invalid invite code"));

        if (!"ACTIVE".equals(study.getStatus())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "Study is not active");
        }

        user.updateNickname(nickname.trim());

        LocalDateTime now = LocalDateTime.now();
        String role = resolveRoleFromInviteCode(inviteCode);
        StudyMember studyMember = StudyMember.join(study.getId(), userId, role, now);
        studyMemberRepository.save(studyMember);

        return MeResponse.registered(user, studyMember);
    }

    private User findOrCreateUser(UserInfo userInfo) {
        return userRepository.findByEmail(userInfo.email())
                .map(existingUser -> updateExistingUser(existingUser, userInfo))
                .orElseGet(() -> createUser(userInfo));
    }

    private User updateExistingUser(User user, UserInfo userInfo) {
        if (!user.getGoogleId().equals(userInfo.googleId())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Google account does not match registered user");
        }

        LocalDateTime now = LocalDateTime.now();
        user.updateLoginInfo(userInfo.nickname(), userInfo.profileImageUrl(), now);
        return user;
    }

    private User createUser(UserInfo userInfo) {
        LocalDateTime now = LocalDateTime.now();
        User user = User.createGoogleUser(
                userInfo.googleId(),
                userInfo.email(),
                userInfo.nickname(),
                userInfo.profileImageUrl(),
                now
        );
        return userRepository.save(user);
    }

    private Optional<StudyMember> findActiveStudyMember(Long userId) {
        return studyMemberRepository.findByUserId(userId)
                .filter(studyMember -> "ACTIVE".equals(studyMember.getStatus()));
    }

    private String resolveRoleFromInviteCode(String inviteCode) {
        if (ADMIN_INVITE_CODE.equalsIgnoreCase(inviteCode.trim())) {
            return "ADMIN";
        }

        return "MEMBER";
    }

    private void saveRefreshToken(Long userId, String refreshToken, String deviceId, String deviceName) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plus(jwtProperties.getRefreshTokenExpiration());

        refreshTokenRepository.findByUserIdAndDeviceId(userId, deviceId)
                .ifPresentOrElse(
                        existingToken -> existingToken.rotate(refreshToken, expiresAt, now),
                        () -> refreshTokenRepository.save(
                                RefreshToken.create(userId, refreshToken, deviceId, deviceName, expiresAt, now)
                        )
                );
    }
}
