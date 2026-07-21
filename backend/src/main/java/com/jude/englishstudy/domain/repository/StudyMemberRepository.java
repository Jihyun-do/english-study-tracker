package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.StudyMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyMemberRepository extends JpaRepository<StudyMember, Long> {
}
