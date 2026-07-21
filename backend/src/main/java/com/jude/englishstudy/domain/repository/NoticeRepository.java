package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
