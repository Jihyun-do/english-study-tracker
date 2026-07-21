package com.jude.englishstudy.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "study_member",
        uniqueConstraints = @UniqueConstraint(name = "UK_STUDY_MEMBER", columnNames = {"study_id", "user_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "study_id", nullable = false)
    private Long studyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public static StudyMember join(Long studyId, Long userId, String role, LocalDateTime now) {
        StudyMember studyMember = new StudyMember();
        studyMember.studyId = studyId;
        studyMember.userId = userId;
        studyMember.role = role;
        studyMember.status = "ACTIVE";
        studyMember.joinedAt = now;
        studyMember.updatedAt = now;
        return studyMember;
    }
}
