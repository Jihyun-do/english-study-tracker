package com.jude.englishstudy.auth.service;

import com.jude.englishstudy.auth.dto.LoginResponse;
import com.jude.englishstudy.auth.dto.UserInfo;
import com.jude.englishstudy.domain.entity.RefreshToken;
import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;
import com.jude.englishstudy.domain.repository.RefreshTokenRepository;
import com.jude.englishstudy.domain.repository.StudyMemberRepository;
import com.jude.englishstudy.domain.repository.UserRepository;
import com.jude.englishstudy.exception.BusinessException;
import com.jude.englishstudy.exception.ErrorCode;
import com.jude.englishstudy.security.jwt.JwtProperties;
import com.jude.englishstudy.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Google OAuth 로그인 후 JWT 발급 및 RefreshToken 저장을 처리한다.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;

    @Transactional
    public LoginResponse login(UserInfo userInfo) {
        User user = findOrCreateUser(userInfo);
        StudyMember studyMember = findActiveStudyMember(user.getId());

        String accessToken = jwtTokenProvider.createAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());
        saveRefreshToken(user.getId(), refreshToken, userInfo.deviceId(), userInfo.deviceName());

        return LoginResponse.of(user, studyMember, accessToken, refreshToken);
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

    private StudyMember findActiveStudyMember(Long userId) {
        StudyMember studyMember = studyMemberRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.FORBIDDEN,
                        "Study membership is required to login"));

        if (!"ACTIVE".equals(studyMember.getStatus())) {
            throw new BusinessException(
                    ErrorCode.FORBIDDEN,
                    "Study membership is required to login");
        }

        return studyMember;
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
