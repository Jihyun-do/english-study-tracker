package com.jude.englishstudy.security.service;

import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;
import com.jude.englishstudy.domain.repository.StudyMemberRepository;
import com.jude.englishstudy.domain.repository.UserRepository;
import com.jude.englishstudy.security.principal.CustomUserPrincipal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudyMemberRepository studyMemberRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("userId로 User와 StudyMember를 조회하여 CustomUserPrincipal을 반환한다")
    void loadUserById() {
        User user = mockUser(1L, "user@example.com", "jude");
        StudyMember studyMember = mockStudyMember("ADMIN");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.of(studyMember));

        UserDetails userDetails = customUserDetailsService.loadUserById(1L);

        assertThat(userDetails).isInstanceOf(CustomUserPrincipal.class);
        CustomUserPrincipal principal = (CustomUserPrincipal) userDetails;
        assertThat(principal.getUserId()).isEqualTo(1L);
        assertThat(principal.getRole()).isEqualTo("ADMIN");
    }

    @Test
    @DisplayName("userId로 User가 없으면 UsernameNotFoundException을 발생시킨다")
    void loadUserByIdUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customUserDetailsService.loadUserById(99L))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("userId로 StudyMember가 없으면 onboarding principal을 반환한다")
    void loadUserByIdStudyMemberNotFound() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(user.getEmail()).thenReturn("user@example.com");
        when(user.getNickname()).thenReturn("jude");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.empty());

        UserDetails userDetails = customUserDetailsService.loadUserById(1L);

        assertThat(userDetails).isInstanceOf(CustomUserPrincipal.class);
        CustomUserPrincipal principal = (CustomUserPrincipal) userDetails;
        assertThat(principal.isOnboarding()).isTrue();
        assertThat(principal.getAuthorities()).isEmpty();
    }

    @Test
    @DisplayName("loadUserByUsername은 email 조회 후 loadUserById를 사용한다")
    void loadUserByUsername() {
        User user = mockUser(1L, "user@example.com", "jude");
        StudyMember studyMember = mockStudyMember("ADMIN");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.of(studyMember));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("user@example.com");

        assertThat(userDetails).isInstanceOf(CustomUserPrincipal.class);
        CustomUserPrincipal principal = (CustomUserPrincipal) userDetails;
        assertThat(principal.getUserId()).isEqualTo(1L);
        assertThat(principal.getEmail()).isEqualTo("user@example.com");
        assertThat(principal.getNickname()).isEqualTo("jude");
        assertThat(principal.getRole()).isEqualTo("ADMIN");
        assertThat(principal.getUsername()).isEqualTo("user@example.com");
    }

    @Test
    @DisplayName("User가 없으면 UsernameNotFoundException을 발생시킨다")
    void userNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customUserDetailsService.loadUserByUsername("missing@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("StudyMember가 없으면 onboarding principal을 반환한다")
    void studyMemberNotFound() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(1L);
        when(user.getEmail()).thenReturn("user@example.com");
        when(user.getNickname()).thenReturn("jude");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(studyMemberRepository.findByUserId(1L)).thenReturn(Optional.empty());

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("user@example.com");

        assertThat(userDetails).isInstanceOf(CustomUserPrincipal.class);
        assertThat(((CustomUserPrincipal) userDetails).isOnboarding()).isTrue();
    }

    private User mockUser(Long id, String email, String nickname) {
        User user = mock(User.class);
        when(user.getId()).thenReturn(id);
        when(user.getEmail()).thenReturn(email);
        when(user.getNickname()).thenReturn(nickname);
        return user;
    }

    private StudyMember mockStudyMember(String role) {
        StudyMember studyMember = mock(StudyMember.class);
        when(studyMember.getRole()).thenReturn(role);
        when(studyMember.getStatus()).thenReturn("ACTIVE");
        return studyMember;
    }
}
