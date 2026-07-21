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
 * email(username) 기준으로 User와 StudyMember를 조회하여 인증 주체를 반환한다.
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

        StudyMember studyMember = studyMemberRepository.findByUserId(user.getId())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Study member not found for user: " + username));

        return CustomUserPrincipal.from(user, studyMember);
    }
}
