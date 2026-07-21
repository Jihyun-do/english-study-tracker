package com.jude.englishstudy.domain.repository;

import com.jude.englishstudy.domain.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileEntityRepository extends JpaRepository<FileEntity, Long> {
}
