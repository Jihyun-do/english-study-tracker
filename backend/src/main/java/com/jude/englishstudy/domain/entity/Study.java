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

import java.time.LocalDate;

@Entity
@Table(name = "study")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Study extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_file_id")
    private Long logoFileId;

    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId;

    @Column(name = "invite_code", nullable = false, length = 50, unique = true)
    private String inviteCode;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "max_member_count", nullable = false)
    private Integer maxMemberCount;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic;

    @Column(nullable = false, length = 20)
    private String status;
}
