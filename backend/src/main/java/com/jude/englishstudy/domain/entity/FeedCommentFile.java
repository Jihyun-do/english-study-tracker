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
        name = "feed_comment_file",
        uniqueConstraints = @UniqueConstraint(name = "UQ_FEED_COMMENT_FILE", columnNames = {"comment_id", "file_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FeedCommentFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comment_id", nullable = false)
    private Long commentId;

    @Column(name = "file_id", nullable = false)
    private Long fileId;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
