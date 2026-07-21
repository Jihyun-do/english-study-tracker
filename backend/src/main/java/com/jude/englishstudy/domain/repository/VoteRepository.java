package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
}
