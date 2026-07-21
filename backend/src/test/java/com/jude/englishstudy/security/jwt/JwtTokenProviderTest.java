package com.jude.englishstudy.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setSecret("test-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256-algorithm");
        jwtProperties.setAccessTokenExpiration(Duration.ofHours(1));
        jwtProperties.setRefreshTokenExpiration(Duration.ofDays(14));

        jwtTokenProvider = new JwtTokenProvider(jwtProperties);
        jwtTokenProvider.init();
    }

    @Test
    @DisplayName("Access Token을 생성하고 검증할 수 있다")
    void createAndValidateAccessToken() {
        String token = jwtTokenProvider.createAccessToken(1L);

        assertThat(jwtTokenProvider.validateAccessToken(token)).isTrue();
        assertThat(jwtTokenProvider.validateRefreshToken(token)).isFalse();
        assertThat(jwtTokenProvider.getUserId(token)).isEqualTo(1L);
        assertThat(jwtTokenProvider.isExpired(token)).isFalse();
        assertThat(jwtTokenProvider.getClaims(token).getIssuer()).isEqualTo(JwtConstants.ISSUER);
    }

    @Test
    @DisplayName("Refresh Token을 생성하고 검증할 수 있다")
    void createAndValidateRefreshToken() {
        String token = jwtTokenProvider.createRefreshToken(2L);

        assertThat(jwtTokenProvider.validateRefreshToken(token)).isTrue();
        assertThat(jwtTokenProvider.validateAccessToken(token)).isFalse();
        assertThat(jwtTokenProvider.getUserId(token)).isEqualTo(2L);
    }

    @Test
    @DisplayName("유효하지 않은 토큰은 validateToken에서 false를 반환한다")
    void invalidTokenValidation() {
        assertThat(jwtTokenProvider.validateToken("invalid.token.value")).isFalse();
        assertThat(jwtTokenProvider.validateAccessToken("invalid.token.value")).isFalse();
    }

    @Test
    @DisplayName("유효하지 않은 토큰은 getClaims/getUserId/isExpired에서 JwtTokenException을 발생시킨다")
    void invalidTokenThrowsException() {
        String invalidToken = "invalid.token.value";

        assertThatThrownBy(() -> jwtTokenProvider.getClaims(invalidToken))
                .isInstanceOf(JwtTokenException.class);
        assertThatThrownBy(() -> jwtTokenProvider.getUserId(invalidToken))
                .isInstanceOf(JwtTokenException.class);
        assertThatThrownBy(() -> jwtTokenProvider.isExpired(invalidToken))
                .isInstanceOf(JwtTokenException.class);
    }
}
