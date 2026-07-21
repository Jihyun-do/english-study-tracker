package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, Long> {
}
