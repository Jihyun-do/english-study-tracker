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

@Entity
@Table(
        name = "assignment_file",
        uniqueConstraints = @UniqueConstraint(name = "UQ_ASSIGNMENT_FILE", columnNames = {"assignment_id", "file_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AssignmentFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(name = "file_id", nullable = false)
    private Long fileId;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
