package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}
