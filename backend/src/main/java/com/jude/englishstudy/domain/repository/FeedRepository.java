package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Feed;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedRepository extends JpaRepository<Feed, Long> {
}
