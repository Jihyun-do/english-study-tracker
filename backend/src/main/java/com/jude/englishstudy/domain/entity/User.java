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
@Table(name = "user")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "google_id", nullable = false, length = 100, unique = true)
    private String googleId;

    @Column(nullable = false, length = 100, unique = true)
    private String email;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(name = "profile_file_id")
    private Long profileFileId;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "terms_agreed_at", nullable = false)
    private LocalDateTime termsAgreedAt;

    @Column(name = "privacy_agreed_at", nullable = false)
    private LocalDateTime privacyAgreedAt;

    public static User createGoogleUser(
            String googleId,
            String email,
            String nickname,
            String profileImageUrl,
            LocalDateTime agreedAt) {
        User user = new User();
        user.googleId = googleId;
        user.email = email;
        user.nickname = nickname;
        user.profileImageUrl = profileImageUrl;
        user.status = "ACTIVE";
        user.lastLoginAt = agreedAt;
        user.termsAgreedAt = agreedAt;
        user.privacyAgreedAt = agreedAt;
        return user;
    }

    public void updateLoginInfo(String nickname, String profileImageUrl, LocalDateTime lastLoginAt) {
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.lastLoginAt = lastLoginAt;
    }
}
