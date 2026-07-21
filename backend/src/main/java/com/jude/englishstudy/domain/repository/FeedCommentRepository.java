package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.FeedComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedCommentRepository extends JpaRepository<FeedComment, Long> {
}
