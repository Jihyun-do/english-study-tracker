-- Jude's English Study - MariaDB 11.x Schema
-- Source: docs/database.md v1.1
-- Note: Logical FK only (no FOREIGN KEY constraints)

SET NAMES utf8mb4;

-- ============================================================
-- Core
-- ============================================================

CREATE TABLE `user` (
  `id`                BIGINT       NOT NULL AUTO_INCREMENT COMMENT '사용자 PK',
  `google_id`         VARCHAR(100) NOT NULL                COMMENT 'Google 사용자 ID',
  `email`             VARCHAR(100) NOT NULL                COMMENT 'Google 이메일',
  `nickname`          VARCHAR(50)  NOT NULL                COMMENT '닉네임',
  `profile_image_url` VARCHAR(500)                         COMMENT 'Google 프로필 이미지',
  `profile_file_id`   BIGINT                               COMMENT '업로드 프로필 이미지',
  `status`            VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' COMMENT '회원 상태',
  `last_login_at`     DATETIME                             COMMENT '마지막 로그인',
  `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '가입일',
  `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `terms_agreed_at`   DATETIME     NOT NULL                COMMENT '이용약관 동의',
  `privacy_agreed_at` DATETIME     NOT NULL                COMMENT '개인정보 동의',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_USER_GOOGLE_ID` (`google_id`),
  UNIQUE KEY `UK_USER_EMAIL` (`email`),
  KEY `IDX_USER_STATUS` (`status`),
  KEY `IDX_USER_LAST_LOGIN_AT` (`last_login_at`),
  CONSTRAINT `CK_USER_STATUS` CHECK (`status` IN ('ACTIVE', 'INACTIVE', 'WITHDRAWN'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자';

CREATE TABLE `study` (
  `id`               BIGINT       NOT NULL AUTO_INCREMENT COMMENT '스터디 PK',
  `name`             VARCHAR(100) NOT NULL                COMMENT '스터디명',
  `description`      TEXT                                 COMMENT '스터디 소개',
  `logo_file_id`     BIGINT                               COMMENT '스터디 대표 이미지',
  `owner_user_id`    BIGINT       NOT NULL                COMMENT '스터디장',
  `invite_code`      VARCHAR(50)  NOT NULL                COMMENT '스터디 초대 코드',
  `start_date`       DATE         NOT NULL                COMMENT '스터디 시작일',
  `max_member_count` INT          NOT NULL DEFAULT 20     COMMENT '최대 스터디 인원',
  `is_public`        TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '공개 여부',
  `status`           VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' COMMENT '스터디 상태',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_STUDY_INVITE_CODE` (`invite_code`),
  KEY `IDX_STUDY_OWNER_USER_ID` (`owner_user_id`),
  KEY `IDX_STUDY_STATUS` (`status`),
  KEY `IDX_STUDY_START_DATE` (`start_date`),
  CONSTRAINT `CK_STUDY_MAX_MEMBER_COUNT` CHECK (`max_member_count` > 0),
  CONSTRAINT `CK_STUDY_STATUS` CHECK (`status` IN ('ACTIVE', 'INACTIVE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='스터디';

CREATE TABLE `file` (
  `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '파일 PK',
  `study_id`      BIGINT       NOT NULL                COMMENT '스터디',
  `user_id`       BIGINT       NOT NULL                COMMENT '업로더',
  `original_name` VARCHAR(255) NOT NULL                COMMENT '원본 파일명',
  `stored_name`   VARCHAR(255) NOT NULL                COMMENT '저장 파일명',
  `mime_type`     VARCHAR(100) NOT NULL                COMMENT 'MIME Type',
  `file_ext`      VARCHAR(20)  NOT NULL                COMMENT '확장자',
  `file_size`     BIGINT       NOT NULL                COMMENT '파일 크기',
  `status`        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' COMMENT '파일 상태',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  PRIMARY KEY (`id`),
  KEY `IDX_FILE_STUDY` (`study_id`),
  KEY `IDX_FILE_UPLOADER` (`user_id`),
  KEY `IDX_FILE_STATUS` (`status`),
  CONSTRAINT `CK_FILE_STATUS` CHECK (`status` IN ('ACTIVE', 'EXPIRED', 'DELETED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='파일';

CREATE TABLE `study_member` (
  `id`         BIGINT      NOT NULL AUTO_INCREMENT COMMENT '스터디 회원 PK',
  `study_id`   BIGINT      NOT NULL                COMMENT '스터디',
  `user_id`    BIGINT      NOT NULL                COMMENT '사용자',
  `role`       VARCHAR(20) NOT NULL DEFAULT 'MEMBER' COMMENT '권한',
  `status`     VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '가입 상태',
  `joined_at`  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '가입일',
  `updated_at` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_STUDY_MEMBER` (`study_id`, `user_id`),
  KEY `IDX_STUDY_MEMBER_STUDY` (`study_id`),
  KEY `IDX_STUDY_MEMBER_USER` (`user_id`),
  KEY `IDX_STUDY_MEMBER_ROLE` (`role`),
  KEY `IDX_STUDY_MEMBER_STATUS` (`status`),
  CONSTRAINT `CK_STUDY_MEMBER_ROLE` CHECK (`role` IN ('OWNER', 'ADMIN', 'MEMBER')),
  CONSTRAINT `CK_STUDY_MEMBER_STATUS` CHECK (`status` IN ('ACTIVE', 'LEFT', 'KICKED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='스터디 회원';

-- ============================================================
-- Assignment
-- ============================================================

CREATE TABLE `assignment` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '과제 PK',
  `study_id`    BIGINT       NOT NULL                COMMENT '스터디 PK (논리 FK)',
  `title`       VARCHAR(200) NOT NULL                COMMENT '과제 제목',
  `description` TEXT                                 COMMENT '과제 설명 및 안내사항',
  `start_at`    DATETIME     NOT NULL                COMMENT '과제 공개 시작 일시',
  `due_at`      DATETIME     NOT NULL                COMMENT '과제 제출 마감 일시',
  `created_by`  BIGINT       NOT NULL                COMMENT '과제를 등록한 사용자 PK (논리 FK)',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `IDX_ASSIGNMENT_STUDY` (`study_id`),
  KEY `IDX_ASSIGNMENT_START` (`start_at`),
  KEY `IDX_ASSIGNMENT_DUE` (`due_at`),
  KEY `IDX_ASSIGNMENT_CREATED_BY` (`created_by`),
  CONSTRAINT `CK_ASSIGNMENT_PERIOD` CHECK (`start_at` <= `due_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='과제';

CREATE TABLE `assignment_file` (
  `id`            BIGINT NOT NULL AUTO_INCREMENT COMMENT '과제 첨부파일 PK',
  `assignment_id` BIGINT NOT NULL                COMMENT '과제 PK (논리 FK)',
  `file_id`       BIGINT NOT NULL                COMMENT '파일 PK (논리 FK)',
  `sort_order`    INT    NOT NULL DEFAULT 1      COMMENT '첨부파일 표시 순서',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_ASSIGNMENT_FILE` (`assignment_id`, `file_id`),
  KEY `IDX_ASSIGNMENT_FILE_ASSIGNMENT` (`assignment_id`),
  KEY `IDX_ASSIGNMENT_FILE_FILE` (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='과제 첨부파일';

CREATE TABLE `assignment_submission` (
  `id`            BIGINT   NOT NULL AUTO_INCREMENT COMMENT '제출 PK',
  `assignment_id` BIGINT   NOT NULL                COMMENT '과제 PK (논리 FK)',
  `user_id`       BIGINT   NOT NULL                COMMENT '제출한 사용자 PK (논리 FK)',
  `comment`       TEXT                             COMMENT '제출 내용 및 코멘트',
  `submitted_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '최초 제출일시',
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 수정일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_ASSIGNMENT_SUBMISSION` (`assignment_id`, `user_id`),
  KEY `IDX_ASSIGNMENT_SUBMISSION_ASSIGNMENT` (`assignment_id`),
  KEY `IDX_ASSIGNMENT_SUBMISSION_USER` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='과제 제출';

CREATE TABLE `assignment_submission_file` (
  `id`            BIGINT NOT NULL AUTO_INCREMENT COMMENT '제출 첨부파일 PK',
  `submission_id` BIGINT NOT NULL                COMMENT '제출 PK (논리 FK)',
  `file_id`       BIGINT NOT NULL                COMMENT '파일 PK (논리 FK)',
  `sort_order`    INT    NOT NULL DEFAULT 1      COMMENT '첨부파일 표시 순서',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_ASSIGNMENT_SUBMISSION_FILE` (`submission_id`, `file_id`),
  KEY `IDX_ASSIGNMENT_SUBMISSION_FILE_SUBMISSION` (`submission_id`),
  KEY `IDX_ASSIGNMENT_SUBMISSION_FILE_FILE` (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='제출 첨부파일';

-- ============================================================
-- Feed
-- ============================================================

CREATE TABLE `feed` (
  `id`                       BIGINT      NOT NULL AUTO_INCREMENT COMMENT '인증 피드 PK',
  `study_id`                 BIGINT      NOT NULL                COMMENT '스터디 PK (논리 FK)',
  `assignment_submission_id` BIGINT      NOT NULL                COMMENT '과제 제출 PK (논리 FK)',
  `feed_type`                VARCHAR(20) NOT NULL DEFAULT 'ASSIGNMENT' COMMENT '피드 유형',
  `is_hidden`                TINYINT(1)  NOT NULL DEFAULT 0      COMMENT '관리자 숨김 여부',
  `hidden_by`                BIGINT                              COMMENT '숨김 처리한 관리자 PK (논리 FK)',
  `hidden_at`                DATETIME                            COMMENT '숨김 처리 일시',
  `created_at`               DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_FEED_SUBMISSION` (`assignment_submission_id`),
  KEY `IDX_FEED_STUDY` (`study_id`),
  KEY `IDX_FEED_SUBMISSION` (`assignment_submission_id`),
  KEY `IDX_FEED_TYPE` (`feed_type`),
  KEY `IDX_FEED_CREATED_AT` (`created_at`),
  CONSTRAINT `CK_FEED_TYPE` CHECK (`feed_type` IN ('ASSIGNMENT'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='인증 피드';

CREATE TABLE `feed_comment` (
  `id`         BIGINT   NOT NULL AUTO_INCREMENT COMMENT '댓글 PK',
  `feed_id`    BIGINT   NOT NULL                COMMENT '인증 피드 PK (논리 FK)',
  `user_id`    BIGINT   NOT NULL                COMMENT '댓글 작성자 PK (논리 FK)',
  `content`    TEXT     NOT NULL                COMMENT '댓글 내용',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`id`),
  KEY `IDX_FEED_COMMENT_FEED` (`feed_id`),
  KEY `IDX_FEED_COMMENT_USER` (`user_id`),
  KEY `IDX_FEED_COMMENT_CREATED_AT` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='피드 댓글';

CREATE TABLE `feed_comment_file` (
  `id`         BIGINT NOT NULL AUTO_INCREMENT COMMENT '댓글 첨부파일 PK',
  `comment_id` BIGINT NOT NULL                COMMENT '댓글 PK (논리 FK)',
  `file_id`    BIGINT NOT NULL                COMMENT '파일 PK (논리 FK)',
  `sort_order` INT    NOT NULL DEFAULT 1      COMMENT '첨부파일 표시 순서',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_FEED_COMMENT_FILE` (`comment_id`, `file_id`),
  KEY `IDX_FEED_COMMENT_FILE_COMMENT` (`comment_id`),
  KEY `IDX_FEED_COMMENT_FILE_FILE` (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='댓글 첨부파일';

CREATE TABLE `feed_like` (
  `id`         BIGINT   NOT NULL AUTO_INCREMENT COMMENT '좋아요 PK',
  `feed_id`    BIGINT   NOT NULL                COMMENT '인증 피드 PK (논리 FK)',
  `user_id`    BIGINT   NOT NULL                COMMENT '좋아요를 누른 사용자 PK (논리 FK)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '좋아요 생성일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_FEED_LIKE` (`feed_id`, `user_id`),
  KEY `IDX_FEED_LIKE_FEED` (`feed_id`),
  KEY `IDX_FEED_LIKE_USER` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='피드 좋아요';

-- ============================================================
-- Topic / Vote
-- ============================================================

CREATE TABLE `topic` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '주제 PK',
  `study_id`    BIGINT       NOT NULL                COMMENT '스터디 PK',
  `user_id`     BIGINT       NOT NULL                COMMENT '작성자 PK',
  `title`       VARCHAR(200) NOT NULL                COMMENT '주제 제목',
  `description` TEXT                                 COMMENT '주제 설명',
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'PENDING' COMMENT '진행 상태',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`id`),
  KEY `IDX_TOPIC_STUDY` (`study_id`),
  KEY `IDX_TOPIC_USER` (`user_id`),
  KEY `IDX_TOPIC_STATUS` (`status`),
  KEY `IDX_TOPIC_CREATED_AT` (`created_at`),
  CONSTRAINT `CK_TOPIC_STATUS` CHECK (`status` IN ('PENDING', 'APPROVED', 'REJECTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주제';

CREATE TABLE `topic_vote` (
  `id`         BIGINT   NOT NULL AUTO_INCREMENT COMMENT '추천 PK',
  `topic_id`   BIGINT   NOT NULL                COMMENT '주제 PK',
  `user_id`    BIGINT   NOT NULL                COMMENT '추천 사용자',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '추천일',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_TOPIC_VOTE` (`topic_id`, `user_id`),
  KEY `IDX_TOPIC_VOTE_TOPIC` (`topic_id`),
  KEY `IDX_TOPIC_VOTE_USER` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주제 추천';

CREATE TABLE `notice` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '공지 PK',
  `study_id`   BIGINT       NOT NULL                COMMENT '스터디 PK',
  `title`      VARCHAR(200) NOT NULL                COMMENT '공지 제목',
  `content`    TEXT         NOT NULL                COMMENT '공지 내용',
  `created_by` BIGINT       NOT NULL                COMMENT '작성 관리자',
  `is_pinned`  TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '상단 고정 여부',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`id`),
  KEY `IDX_NOTICE_STUDY` (`study_id`),
  KEY `IDX_NOTICE_CREATED_BY` (`created_by`),
  KEY `IDX_NOTICE_PINNED` (`is_pinned`),
  KEY `IDX_NOTICE_CREATED_AT` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='공지사항';

CREATE TABLE `vote` (
  `id`             BIGINT       NOT NULL AUTO_INCREMENT COMMENT '투표 PK',
  `study_id`       BIGINT       NOT NULL                COMMENT '스터디 PK',
  `title`          VARCHAR(200) NOT NULL                COMMENT '투표 제목',
  `description`    TEXT                                 COMMENT '투표 설명',
  `created_by`     BIGINT       NOT NULL                COMMENT '작성 관리자',
  `allow_multiple` TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '복수 선택 허용 여부',
  `is_anonymous`   TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '익명 투표 여부',
  `start_at`       DATETIME     NOT NULL                COMMENT '시작일시',
  `end_at`         DATETIME     NOT NULL                COMMENT '종료일시',
  `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`id`),
  KEY `IDX_VOTE_STUDY` (`study_id`),
  KEY `IDX_VOTE_CREATED_BY` (`created_by`),
  KEY `IDX_VOTE_END_AT` (`end_at`),
  KEY `IDX_VOTE_CREATED_AT` (`created_at`),
  CONSTRAINT `CK_VOTE_PERIOD` CHECK (`start_at` < `end_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='투표';

CREATE TABLE `vote_option` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '선택지 PK',
  `vote_id`    BIGINT       NOT NULL                COMMENT '투표 PK',
  `content`    VARCHAR(200) NOT NULL                COMMENT '선택지 내용',
  `sort_order` INT          NOT NULL DEFAULT 1      COMMENT '표시 순서',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  PRIMARY KEY (`id`),
  KEY `IDX_VOTE_OPTION_VOTE` (`vote_id`),
  KEY `IDX_VOTE_OPTION_SORT` (`vote_id`, `sort_order`),
  CONSTRAINT `CK_VOTE_OPTION_SORT` CHECK (`sort_order` >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='투표 선택지';

CREATE TABLE `vote_answer` (
  `id`             BIGINT   NOT NULL AUTO_INCREMENT COMMENT '투표 결과 PK',
  `vote_id`        BIGINT   NOT NULL                COMMENT '투표 PK',
  `vote_option_id` BIGINT   NOT NULL                COMMENT '선택지 PK',
  `user_id`        BIGINT   NOT NULL                COMMENT '사용자 PK',
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '투표일시',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_VOTE_ANSWER` (`vote_option_id`, `user_id`),
  KEY `IDX_VOTE_ANSWER_VOTE` (`vote_id`),
  KEY `IDX_VOTE_ANSWER_OPTION` (`vote_option_id`),
  KEY `IDX_VOTE_ANSWER_USER` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='투표 결과';

-- ============================================================
-- System
-- ============================================================

CREATE TABLE `notification` (
  `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '알림 PK',
  `study_id`    BIGINT       NOT NULL                COMMENT '스터디 PK',
  `user_id`     BIGINT       NOT NULL                COMMENT '알림 대상 사용자',
  `type`        VARCHAR(30)  NOT NULL                COMMENT '알림 유형',
  `title`       VARCHAR(200) NOT NULL                COMMENT '알림 제목',
  `content`     TEXT         NOT NULL                COMMENT '알림 내용',
  `target_type` VARCHAR(30)  NOT NULL                COMMENT '이동 대상 타입',
  `target_id`   BIGINT       NOT NULL                COMMENT '이동 대상 PK',
  `is_read`     TINYINT(1)   NOT NULL DEFAULT 0      COMMENT '읽음 여부',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `read_at`     DATETIME                             COMMENT '읽은 일시',
  PRIMARY KEY (`id`),
  KEY `IDX_NOTIFICATION_USER` (`user_id`),
  KEY `IDX_NOTIFICATION_STUDY` (`study_id`),
  KEY `IDX_NOTIFICATION_READ` (`is_read`),
  KEY `IDX_NOTIFICATION_CREATED_AT` (`created_at`),
  CONSTRAINT `CK_NOTIFICATION_TYPE` CHECK (`type` IN ('ASSIGNMENT', 'FEED_COMMENT', 'NOTICE', 'VOTE', 'SYSTEM')),
  CONSTRAINT `CK_NOTIFICATION_TARGET_TYPE` CHECK (`target_type` IN ('ASSIGNMENT', 'FEED', 'NOTICE', 'VOTE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='알림';

CREATE TABLE `refresh_token` (
  `id`             BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `user_id`        BIGINT       NOT NULL                COMMENT '사용자 PK',
  `refresh_token`  VARCHAR(500) NOT NULL                COMMENT 'Refresh Token',
  `device_id`      VARCHAR(100) NOT NULL                COMMENT '디바이스 식별값',
  `device_name`    VARCHAR(100) NOT NULL                COMMENT '디바이스 이름',
  `expires_at`     DATETIME     NOT NULL                COMMENT '만료일',
  `last_access_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '마지막 사용',
  `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_REFRESH_TOKEN` (`refresh_token`),
  KEY `IDX_REFRESH_TOKEN_USER` (`user_id`),
  KEY `IDX_REFRESH_TOKEN_DEVICE` (`device_id`),
  KEY `IDX_REFRESH_TOKEN_EXPIRES` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Refresh Token';

CREATE TABLE `encouragement_message` (
  `id`         BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `content`    VARCHAR(300) NOT NULL                COMMENT '응원 문구',
  `is_active`  TINYINT(1)   NOT NULL DEFAULT 1      COMMENT '사용 여부',
  `created_by` BIGINT       NOT NULL                COMMENT '등록 관리자',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  PRIMARY KEY (`id`),
  KEY `IDX_ENCOURAGEMENT_ACTIVE` (`is_active`),
  KEY `IDX_ENCOURAGEMENT_CREATED_BY` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='응원 문구';
