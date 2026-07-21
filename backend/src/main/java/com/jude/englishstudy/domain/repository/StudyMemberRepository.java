package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.StudyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyMemberRepository extends JpaRepository<StudyMember, Long> {

    Optional<StudyMember> findByUserId(Long userId);
}
