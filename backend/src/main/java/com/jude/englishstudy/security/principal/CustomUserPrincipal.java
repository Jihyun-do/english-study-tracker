package com.jude.englishstudy.security.principal;

import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Spring Security 인증 주체.
 * User 정보와 study_member.role 기반 권한을 SecurityContext에서 사용한다.
 */
@Getter
public class CustomUserPrincipal implements UserDetails {

    private final Long userId;
    private final String email;
    private final String nickname;
    private final String role;

    private CustomUserPrincipal(Long userId, String email, String nickname, String role) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }

    public static CustomUserPrincipal from(User user, StudyMember studyMember) {
        return new CustomUserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                studyMember.getRole()
        );
    }

    public static CustomUserPrincipal fromOnboarding(User user) {
        return new CustomUserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                null
        );
    }

    public boolean isOnboarding() {
        return role == null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) {
            return Collections.emptyList();
        }

        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
