package com.jude.englishstudy.security.service;

import com.jude.englishstudy.domain.entity.StudyMember;
import com.jude.englishstudy.domain.entity.User;
import com.jude.englishstudy.domain.repository.StudyMemberRepository;
import com.jude.englishstudy.domain.repository.UserRepository;
import com.jude.englishstudy.security.principal.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * User 조회 후 CustomUserPrincipal을 반환한다.
 * MVP 정책: 사용자당 하나의 StudyMember만 존재한다.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StudyMemberRepository studyMemberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return loadUserById(user.getId());
    }

    public UserDetails loadUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        return studyMemberRepository.findByUserId(userId)
                .filter(studyMember -> "ACTIVE".equals(studyMember.getStatus()))
                .<UserDetails>map(studyMember -> CustomUserPrincipal.from(user, studyMember))
                .orElseGet(() -> CustomUserPrincipal.fromOnboarding(user));
    }
}
