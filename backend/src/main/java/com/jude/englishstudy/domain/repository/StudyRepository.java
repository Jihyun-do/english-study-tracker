package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Study;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyRepository extends JpaRepository<Study, Long> {
}
