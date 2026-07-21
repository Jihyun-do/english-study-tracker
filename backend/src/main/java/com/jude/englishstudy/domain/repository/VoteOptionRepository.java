package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.VoteOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteOptionRepository extends JpaRepository<VoteOption, Long> {
}
