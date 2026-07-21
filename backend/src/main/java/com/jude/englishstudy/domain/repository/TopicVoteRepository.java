package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.TopicVote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicVoteRepository extends JpaRepository<TopicVote, Long> {
}
