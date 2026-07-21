package com.jude.englishstudy.security.principal;

import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserPrincipalTest {

    @Test
    @DisplayName("User와 StudyMember로부터 CustomUserPrincipal을 생성한다")
    void fromUserAndStudyMember() {
        User user = mockUser(1L, "user@example.com", "jude");
        StudyMember studyMember = mockStudyMember("MEMBER");

        CustomUserPrincipal principal = CustomUserPrincipal.from(user, studyMember);

        assertThat(principal.getUserId()).isEqualTo(1L);
        assertThat(principal.getEmail()).isEqualTo("user@example.com");
        assertThat(principal.getNickname()).isEqualTo("jude");
        assertThat(principal.getRole()).isEqualTo("MEMBER");
        assertThat(principal.getUsername()).isEqualTo("user@example.com");
        assertThat(principal.getPassword()).isNull();
    }

    @ParameterizedTest
    @CsvSource({
            "OWNER, ROLE_OWNER",
            "ADMIN, ROLE_ADMIN",
            "MEMBER, ROLE_MEMBER"
    })
    @DisplayName("study_member.role에 ROLE_ 접두사를 붙여 GrantedAuthority를 생성한다")
    void roleAuthority(String studyRole, String expectedAuthority) {
        CustomUserPrincipal principal = CustomUserPrincipal.from(
                mockUser(1L, "a@b.com", "nick"),
                mockStudyMember(studyRole)
        );

        assertThat(principal.getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly(expectedAuthority);
    }

    @Test
    @DisplayName("account 관련 메서드는 모두 true를 반환한다")
    void accountStatusMethods() {
        CustomUserPrincipal principal = CustomUserPrincipal.from(
                mockUser(1L, "a@b.com", "nick"),
                mockStudyMember("MEMBER")
        );

        assertThat(principal.isAccountNonExpired()).isTrue();
        assertThat(principal.isAccountNonLocked()).isTrue();
        assertThat(principal.isCredentialsNonExpired()).isTrue();
        assertThat(principal.isEnabled()).isTrue();
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
        return studyMember;
    }
}
