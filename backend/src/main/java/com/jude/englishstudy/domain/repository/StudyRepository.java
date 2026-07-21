package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Study;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyRepository extends JpaRepository<Study, Long> {

    Optional<Study> findByInviteCodeIgnoreCase(String inviteCode);
}
