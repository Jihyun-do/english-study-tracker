package com.jude.englishstudy.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "feed")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Feed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "study_id", nullable = false)
    private Long studyId;

    @Column(name = "assignment_submission_id", nullable = false, unique = true)
    private Long assignmentSubmissionId;

    @Column(name = "feed_type", nullable = false, length = 20)
    private String feedType;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden;

    @Column(name = "hidden_by")
    private Long hiddenBy;

    @Column(name = "hidden_at")
    private LocalDateTime hiddenAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
