package com.jude.englishstudy.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_token")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "refresh_token", nullable = false, length = 500, unique = true)
    private String refreshToken;

    @Column(name = "device_id", nullable = false, length = 100)
    private String deviceId;

    @Column(name = "device_name", nullable = false, length = 100)
    private String deviceName;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "last_access_at", nullable = false)
    private LocalDateTime lastAccessAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public static RefreshToken create(
            Long userId,
            String refreshToken,
            String deviceId,
            String deviceName,
            LocalDateTime expiresAt,
            LocalDateTime now) {
        RefreshToken token = new RefreshToken();
        token.userId = userId;
        token.refreshToken = refreshToken;
        token.deviceId = deviceId;
        token.deviceName = deviceName;
        token.expiresAt = expiresAt;
        token.lastAccessAt = now;
        token.createdAt = now;
        return token;
    }

    public void rotate(String refreshToken, LocalDateTime expiresAt, LocalDateTime lastAccessAt) {
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
        this.lastAccessAt = lastAccessAt;
    }
}
