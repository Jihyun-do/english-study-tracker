# Jude's English Study Database Design

> Version: v1.1

> Last Updated: 2026-07-21

---

# 목차

1. 프로젝트 개요
2. DB 설계 원칙
3. 네이밍 규칙
4. 공통 컬럼 규칙
5. DB 구성
6. 테이블 상세
7. 변경 이력

---

# 1. 프로젝트 개요

## 프로젝트 소개

Jude's English Study는 영어 스터디 운영을 위한 웹 기반 학습 관리 서비스이다.

사용자는 과제 제출, 인증 피드, 주제 제안, 투표, 공지사항 등의 기능을 이용할 수 있으며,

관리자는 스터디 운영에 필요한 기능을 관리할 수 있다.

본 프로젝트는 실제 운영 서비스를 목표로 설계되었으며,

Vue3 + Spring Boot + MariaDB 기반으로 개발한다.

---

## 기술 스택

### Frontend

- Vue3
- Vite
- Pinia
- Vue Router

### Backend

- Spring Boot
- Spring Data JPA
- Spring Security
- OAuth2 (Google)

### Database

- MariaDB

### Storage

- Local Storage
- Database에는 파일 메타데이터만 저장

---

# 2. DB 설계 원칙

## 운영 서비스를 기준으로 설계

학습용 프로젝트가 아닌 실제 운영 서비스를 목표로 설계한다.

---

## 논리 FK 사용

Foreign Key는 논리적으로만 관리한다.

MariaDB에는 Physical FK Constraint를 생성하지 않는다.

---

## 파일 저장 정책

파일(Binary Data)은 Database에 저장하지 않는다.

Database에는 메타데이터만 저장한다.

실제 파일은 서버 스토리지(Local Storage)에 저장한다.

---

## Google OAuth 로그인

Google OAuth 로그인만 지원한다.

Password는 저장하지 않는다.

---

## Multi Study 구조

모든 데이터는 Study를 기준으로 관리한다.

향후 여러 스터디 운영을 고려하여 설계한다.

---

## 다중 기기 로그인

Refresh Token은 사용자 기준이 아닌 Device 기준으로 관리한다.

---

## 공통 시간 컬럼

모든 주요 테이블은 다음 컬럼을 사용한다.

- created_at
- updated_at

---

# 3. 네이밍 규칙

## 테이블

- 단수형 사용
- snake_case
- 소문자

예)

study

user

assignment

feed

---

## 컬럼

snake_case 사용

예)

created_at

updated_at

study_id

user_id

---

## Primary Key

모든 PK는

id

사용

---

## Foreign Key

참조 컬럼은

study_id

user_id

assignment_id

형태를 사용한다.

※ Physical FK는 생성하지 않는다.

---

## Boolean

is_ 접두어 사용

예)

is_public

is_hidden

---

## ENUM

VARCHAR 타입으로 저장한다.

예)

status

role

type

---

## Index

idx_테이블명_컬럼명

예)

idx_assignment_due_date

---

## Unique

uk_테이블명_컬럼명

예)

uk_study_invite_code

---

# 4. 공통 컬럼 규칙

|컬럼|타입|설명|

|------|------|------|

|id|BIGINT|PK (AUTO_INCREMENT)|

|created_at|DATETIME|생성일시|

|updated_at|DATETIME|수정일시|

|status|VARCHAR(20)|상태값|

|study_id|BIGINT|스터디 ID (논리 FK)|

|user_id|BIGINT|사용자 ID (논리 FK)|

---

# 5. DB 구성

총 21개의 테이블로 구성된다.

## Core

- study
- user
- study_member
- file

## Assignment

- assignment
- assignment_file
- assignment_submission
- assignment_submission_file

## Feed

- feed
- feed_comment
- feed_comment_file
- feed_like

## Topic / Vote

- topic
- topic_vote
- notice
- vote
- vote_option
- vote_answer

## System

- notification
- refresh_token
- encouragement_message

---

# 6. 테이블 상세

---

# Table : study

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 스터디 PK |

| name | VARCHAR(100) | | | ❌ | | | 스터디명 |

| description | TEXT | | | ✅ | | | 스터디 소개 |

| logo_file_id | BIGINT | | [file.id](http://file.id) | ✅ | | | 스터디 대표 이미지 |

| owner_user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 스터디장 |

| invite_code | VARCHAR(50) | | | ❌ | ✅ | | 스터디 초대 코드 |

| start_date | DATE | | | ❌ | | | 스터디 시작일 |

| max_member_count | INT | | | ❌ | | 20 | 최대 스터디 인원 |

| is_public | BOOLEAN | | | ❌ | | FALSE | 공개 여부 |

| status | VARCHAR(20) | | | ❌ | | ACTIVE | 스터디 상태 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_STUDY | id | PRIMARY KEY |

| UK_STUDY_INVITE_CODE | invite_code | UNIQUE |

| IDX_STUDY_OWNER_USER_ID | owner_user_id | INDEX |

| IDX_STUDY_STATUS | status | INDEX |

| IDX_STUDY_START_DATE | start_date | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_STUDY | PRIMARY KEY | id |

| UK_STUDY_INVITE_CODE | UNIQUE | invite_code |

| CK_STUDY_MAX_MEMBER_COUNT | CHECK | max_member_count > 0 |

| FK_STUDY_OWNER_USER | Logical FK | owner_user_id → [user.id](http://user.id) |

| FK_STUDY_LOGO_FILE | Logical FK | logo_file_id → [file.id](http://file.id) |

## Enum

### status

| Value | Description |

|------|-------------|

| ACTIVE | 운영중 |

| INACTIVE | 비활성 |

---

# Table : user

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 사용자 PK |

| google_id | VARCHAR(100) | | | ❌ | ✅ | | Google 사용자 ID |

| email | VARCHAR(100) | | | ❌ | ✅ | | Google 이메일 |

| nickname | VARCHAR(50) | | | ❌ | | | 닉네임 |

| profile_image_url | VARCHAR(500) | | | ✅ | | | Google 프로필 이미지 |

| profile_file_id | BIGINT | | [file.id](http://file.id) | ✅ | | | 업로드 프로필 이미지 |

| status | VARCHAR(20) | | | ❌ | | ACTIVE | 회원 상태 |

| last_login_at | DATETIME | | | ✅ | | | 마지막 로그인 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 가입일 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일 |

| terms_agreed_at | DATETIME | | | ❌ | | | 이용약관 동의 |

| privacy_agreed_at | DATETIME | | | ❌ | | | 개인정보 동의 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_USER | id | PRIMARY KEY |

| UK_USER_GOOGLE_ID | google_id | UNIQUE |

| UK_USER_EMAIL | email | UNIQUE |

| IDX_USER_STATUS | status | INDEX |

| IDX_USER_LAST_LOGIN_AT | last_login_at | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_USER | PRIMARY KEY | id |

| UK_USER_GOOGLE_ID | UNIQUE | google_id |

| UK_USER_EMAIL | UNIQUE | email |

| FK_USER_PROFILE_FILE | Logical FK | profile_file_id → [file.id](http://file.id) |

## Enum

### status

| Value | Description |

|------|-------------|

| ACTIVE | 활동중 |

| INACTIVE | 비활성 |

| WITHDRAWN | 탈퇴 |

---

# Table : study_member

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 스터디 회원 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 사용자 |

| role | VARCHAR(20) | | | ❌ | | MEMBER | 권한 |

| status | VARCHAR(20) | | | ❌ | | ACTIVE | 가입 상태 |

| joined_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 가입일 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_STUDY_MEMBER | id | PRIMARY KEY |

| UK_STUDY_MEMBER | study_id, user_id | UNIQUE |

| IDX_STUDY_MEMBER_STUDY | study_id | INDEX |

| IDX_STUDY_MEMBER_USER | user_id | INDEX |

| IDX_STUDY_MEMBER_ROLE | role | INDEX |

| IDX_STUDY_MEMBER_STATUS | status | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_STUDY_MEMBER | PRIMARY KEY | id |

| UK_STUDY_MEMBER | UNIQUE | study_id + user_id |

| FK_STUDY_MEMBER_STUDY | Logical FK | study_id → [study.id](http://study.id) |

| FK_STUDY_MEMBER_USER | Logical FK | user_id → [user.id](http://user.id) |

## Enum

### role

| Value | Description |

|------|-------------|

| OWNER | 스터디장 |

| ADMIN | 관리자 |

| MEMBER | 일반 회원 |

### status

| Value | Description |

|------|-------------|

| ACTIVE | 활동중 |

| LEFT | 탈퇴 |

| KICKED | 강퇴 |

---

# Table : file

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 파일 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 업로더 |

| original_name | VARCHAR(255) | | | ❌ | | | 원본 파일명 |

| stored_name | VARCHAR(255) | | | ❌ | | | 저장 파일명 |

| mime_type | VARCHAR(100) | | | ❌ | | | MIME Type |

| file_ext | VARCHAR(20) | | | ❌ | | | 확장자 |

| file_size | BIGINT | | | ❌ | | | 파일 크기 |

| status | VARCHAR(20) | | | ❌ | | ACTIVE | 파일 상태 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_FILE | id | PRIMARY KEY |

| IDX_FILE_STUDY | study_id | INDEX |

| IDX_FILE_UPLOADER | user_id | INDEX |

| IDX_FILE_STATUS | status | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_FILE | PRIMARY KEY | id |

| FK_FILE_STUDY | Logical FK | study_id → [study.id](http://study.id) |

| FK_FILE_USER | Logical FK | user_id → [user.id](http://user.id) |

| CK_FILE_STATUS | CHECK | FILE_STATUS Enum 사용 |

## Enum

### status

| Value | Description |

|------|-------------|

| ACTIVE | 정상 |

| EXPIRED | 다운로드 만료 |

| DELETED | 삭제 |

---

# Table : assignment

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 과제 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 PK (논리 FK) |

| title | VARCHAR(200) | | | ❌ | | | 과제 제목 |

| description | TEXT | | | ✅ | | | 과제 설명 및 안내사항 |

| start_at | DATETIME | | | ❌ | | | 과제 공개 시작 일시 |

| due_at | DATETIME | | | ❌ | | | 과제 제출 마감 일시 |

| created_by | BIGINT | | [user.id](http://user.id) | ❌ | | | 과제를 등록한 사용자 PK (논리 FK) |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일시 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일시 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_ASSIGNMENT | id | PRIMARY KEY |

| IDX_ASSIGNMENT_STUDY | study_id | INDEX |

| IDX_ASSIGNMENT_START | start_at | INDEX |

| IDX_ASSIGNMENT_DUE | due_at | INDEX |

| IDX_ASSIGNMENT_CREATED_BY | created_by | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_ASSIGNMENT | PRIMARY KEY | id |

| NN_ASSIGNMENT_STUDY | NOT NULL | study_id |

| NN_ASSIGNMENT_TITLE | NOT NULL | title |

| NN_ASSIGNMENT_START | NOT NULL | start_at |

| NN_ASSIGNMENT_DUE | NOT NULL | due_at |

| NN_ASSIGNMENT_CREATED_BY | NOT NULL | created_by |

| NN_ASSIGNMENT_CREATED_AT | NOT NULL | created_at |

| NN_ASSIGNMENT_UPDATED_AT | NOT NULL | updated_at |

| CK_ASSIGNMENT_PERIOD | CHECK | start_at <= due_at |

| FK_ASSIGNMENT_STUDY | Logical FK | study_id → [study.id](http://study.id) |

| FK_ASSIGNMENT_CREATED_BY | Logical FK | created_by → [user.id](http://user.id) |

## Enum

> 상태는 저장하지 않으며 기간으로 계산한다.

| Status | Condition |

|--------|-----------|

| 예약 | NOW() < start_at |

| 진행중 | start_at <= NOW() <= due_at |

| 마감 | NOW() > due_at |

---

# Table : assignment_file

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 과제 첨부파일 PK |

| assignment_id | BIGINT | | [assignment.id](http://assignment.id) | ❌ | | | 과제 PK (논리 FK) |

| file_id | BIGINT | | [file.id](http://file.id) | ❌ | | | 파일 PK (논리 FK) |

| sort_order | INT | | | ❌ | | 1 | 첨부파일 표시 순서 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_ASSIGNMENT_FILE | id | PRIMARY KEY |

| IDX_ASSIGNMENT_FILE_ASSIGNMENT | assignment_id | INDEX |

| IDX_ASSIGNMENT_FILE_FILE | file_id | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_ASSIGNMENT_FILE | PRIMARY KEY | id |

| UQ_ASSIGNMENT_FILE | UNIQUE | assignment_id + file_id |

| NN_ASSIGNMENT_FILE_ASSIGNMENT | NOT NULL | assignment_id |

| NN_ASSIGNMENT_FILE_FILE | NOT NULL | file_id |

| NN_ASSIGNMENT_FILE_SORT_ORDER | NOT NULL | sort_order |

| FK_ASSIGNMENT_FILE_ASSIGNMENT | Logical FK | assignment_id → [assignment.id](http://assignment.id) |

| FK_ASSIGNMENT_FILE_FILE | Logical FK | file_id → [file.id](http://file.id) |

---

# Table : assignment_submission

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 제출 PK |

| assignment_id | BIGINT | | [assignment.id](http://assignment.id) | ❌ | | | 과제 PK (논리 FK) |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 제출한 사용자 PK (논리 FK) |

| comment | TEXT | | | ✅ | | | 제출 내용 및 코멘트 |

| submitted_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 최초 제출일시 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 마지막 수정일시 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_ASSIGNMENT_SUBMISSION | id | PRIMARY KEY |

| IDX_ASSIGNMENT_SUBMISSION_ASSIGNMENT | assignment_id | INDEX |

| IDX_ASSIGNMENT_SUBMISSION_USER | user_id | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_ASSIGNMENT_SUBMISSION | PRIMARY KEY | id |

| UQ_ASSIGNMENT_SUBMISSION | UNIQUE | assignment_id + user_id |

| NN_ASSIGNMENT_SUBMISSION_ASSIGNMENT | NOT NULL | assignment_id |

| NN_ASSIGNMENT_SUBMISSION_USER | NOT NULL | user_id |

| NN_ASSIGNMENT_SUBMISSION_SUBMITTED_AT | NOT NULL | submitted_at |

| NN_ASSIGNMENT_SUBMISSION_UPDATED_AT | NOT NULL | updated_at |

| FK_ASSIGNMENT_SUBMISSION_ASSIGNMENT | Logical FK | assignment_id → [assignment.id](http://assignment.id) |

| FK_ASSIGNMENT_SUBMISSION_USER | Logical FK | user_id → [user.id](http://user.id) |

---

# Table : assignment_submission_file

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 제출 첨부파일 PK |

| submission_id | BIGINT | | assignment_[submission.id](http://submission.id) | ❌ | | | 제출 PK (논리 FK) |

| file_id | BIGINT | | [file.id](http://file.id) | ❌ | | | 파일 PK (논리 FK) |

| sort_order | INT | | | ❌ | | 1 | 첨부파일 표시 순서 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_ASSIGNMENT_SUBMISSION_FILE | id | PRIMARY KEY |

| IDX_ASSIGNMENT_SUBMISSION_FILE_SUBMISSION | submission_id | INDEX |

| IDX_ASSIGNMENT_SUBMISSION_FILE_FILE | file_id | INDEX |

## Constraints

| Name | Type | Description |

|------|------|-------------|

| PK_ASSIGNMENT_SUBMISSION_FILE | PRIMARY KEY | id |

| UQ_ASSIGNMENT_SUBMISSION_FILE | UNIQUE | submission_id + file_id |

| NN_ASSIGNMENT_SUBMISSION_FILE_SUBMISSION | NOT NULL | submission_id |

| NN_ASSIGNMENT_SUBMISSION_FILE_FILE | NOT NULL | file_id |

| NN_ASSIGNMENT_SUBMISSION_FILE_SORT_ORDER | NOT NULL | sort_order |

| FK_ASSIGNMENT_SUBMISSION_FILE_SUBMISSION | Logical FK | submission_id → assignment_[submission.id](http://submission.id) |

| FK_ASSIGNMENT_SUBMISSION_FILE_FILE | Logical FK | file_id → [file.id](http://file.id) |

---

# Table : feed

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 인증 피드 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 PK (논리 FK) |

| assignment_submission_id | BIGINT | | assignment_[submission.id](http://submission.id) | ❌ | ✅ | | 과제 제출 PK (논리 FK) |

| feed_type | VARCHAR(20) | | | ❌ | | ASSIGNMENT | 피드 유형 |

| is_hidden | BOOLEAN | | | ❌ | | FALSE | 관리자 숨김 여부 |

| hidden_by | BIGINT | | [user.id](http://user.id) | ✅ | | | 숨김 처리한 관리자 PK (논리 FK) |

| hidden_at | DATETIME | | | ✅ | | | 숨김 처리 일시 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일시 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_FEED | id | PRIMARY KEY |

| UQ_FEED_SUBMISSION | assignment_submission_id | UNIQUE |

| IDX_FEED_STUDY | study_id | INDEX |

| IDX_FEED_SUBMISSION | assignment_submission_id | INDEX |

| IDX_FEED_TYPE | feed_type | INDEX |

| IDX_FEED_CREATED_AT | created_at | INDEX |

## Constraints

| Name | Description |

|------|-------------|

| PK_FEED | PRIMARY KEY (id) |

| UQ_FEED_SUBMISSION | UNIQUE (assignment_submission_id) |

| NN_FEED_STUDY | study_id NOT NULL |

| NN_FEED_SUBMISSION | assignment_submission_id NOT NULL |

| NN_FEED_TYPE | feed_type NOT NULL |

| FK_FEED_STUDY | Logical FK → [study.id](http://study.id) |

| FK_FEED_SUBMISSION | Logical FK → assignment_[submission.id](http://submission.id) |

| FK_FEED_HIDDEN_BY | Logical FK → [user.id](http://user.id) |

## Enum

### feed_type

| Value | Description |

|-------|-------------|

| ASSIGNMENT | 과제 인증 |

---

# Table : feed_comment

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 댓글 PK |

| feed_id | BIGINT | | [feed.id](http://feed.id) | ❌ | | | 인증 피드 PK (논리 FK) |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 댓글 작성자 PK (논리 FK) |

| content | TEXT | | | ❌ | | | 댓글 내용 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 작성일시 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일시 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_FEED_COMMENT | id | PRIMARY KEY |

| IDX_FEED_COMMENT_FEED | feed_id | INDEX |

| IDX_FEED_COMMENT_USER | user_id | INDEX |

| IDX_FEED_COMMENT_CREATED_AT | created_at | INDEX |

## Constraints

| Name | Description |

|------|-------------|

| PK_FEED_COMMENT | PRIMARY KEY (id) |

| NN_FEED_COMMENT_FEED | feed_id NOT NULL |

| NN_FEED_COMMENT_USER | user_id NOT NULL |

| NN_FEED_COMMENT_CONTENT | content NOT NULL |

| NN_FEED_COMMENT_CREATED_AT | created_at NOT NULL |

| NN_FEED_COMMENT_UPDATED_AT | updated_at NOT NULL |

| FK_FEED_COMMENT_FEED | Logical FK → [feed.id](http://feed.id) |

| FK_FEED_COMMENT_USER | Logical FK → [user.id](http://user.id) |

---

# Table : feed_comment_file

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 댓글 첨부파일 PK |

| comment_id | BIGINT | | feed_[comment.id](http://comment.id) | ❌ | | | 댓글 PK (논리 FK) |

| file_id | BIGINT | | [file.id](http://file.id) | ❌ | | | 파일 PK (논리 FK) |

| sort_order | INT | | | ❌ | | 1 | 첨부파일 표시 순서 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_FEED_COMMENT_FILE | id | PRIMARY KEY |

| IDX_FEED_COMMENT_FILE_COMMENT | comment_id | INDEX |

| IDX_FEED_COMMENT_FILE_FILE | file_id | INDEX |

## Constraints

| Name | Description |

|------|-------------|

| PK_FEED_COMMENT_FILE | PRIMARY KEY (id) |

| UQ_FEED_COMMENT_FILE | UNIQUE (comment_id, file_id) |

| NN_FEED_COMMENT_FILE_COMMENT | comment_id NOT NULL |

| NN_FEED_COMMENT_FILE_FILE | file_id NOT NULL |

| NN_FEED_COMMENT_FILE_SORT_ORDER | sort_order NOT NULL |

| FK_FEED_COMMENT_FILE_COMMENT | Logical FK → feed_[comment.id](http://comment.id) |

| FK_FEED_COMMENT_FILE_FILE | Logical FK → [file.id](http://file.id) |

---

# Table : feed_like

## Columns

| Column | Type | PK | FK | Null | Unique | Default | Description |

|---------|------|----|----|------|--------|---------|-------------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 좋아요 PK |

| feed_id | BIGINT | | [feed.id](http://feed.id) | ❌ | | | 인증 피드 PK (논리 FK) |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 좋아요를 누른 사용자 PK (논리 FK) |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 좋아요 생성일시 |

## Indexes

| Name | Columns | Type |

|------|---------|------|

| PK_FEED_LIKE | id | PRIMARY KEY |

| UQ_FEED_LIKE | feed_id, user_id | UNIQUE |

| IDX_FEED_LIKE_FEED | feed_id | INDEX |

| IDX_FEED_LIKE_USER | user_id | INDEX |

## Constraints

| Name | Description |

|------|-------------|

| PK_FEED_LIKE | PRIMARY KEY (id) |

| UQ_FEED_LIKE | UNIQUE (feed_id, user_id) |

| NN_FEED_LIKE_FEED | feed_id NOT NULL |

| NN_FEED_LIKE_USER | user_id NOT NULL |

| NN_FEED_LIKE_CREATED_AT | created_at NOT NULL |

| FK_FEED_LIKE_FEED | Logical FK → [feed.id](http://feed.id) |

| FK_FEED_LIKE_USER | Logical FK → [user.id](http://user.id) |

---

# Table : topic

스터디에서 토론하거나 학습하고 싶은 주제를 제안하는 테이블

## 목적

스터디원이 자유롭게 영어 학습 주제를 제안할 수 있다.

제안된 주제는 다른 스터디원이 투표할 수 있으며, 관리자가 채택 여부를 결정한다.

## 관련 화면

- 주제 제안
- 홈
- 관리자 > 주제 관리

## 관련 테이블

- study
- user
- topic_vote

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 주제 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 PK |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 작성자 PK |

| title | VARCHAR(200) | | | ❌ | | | 주제 제목 |

| description | TEXT | | | ✅ | | | 주제 설명 |

| status | VARCHAR(20) | | | ❌ | | PENDING | 진행 상태 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_TOPIC | id | PRIMARY KEY | 기본키 |

| IDX_TOPIC_STUDY | study_id | INDEX | 스터디 조회 |

| IDX_TOPIC_USER | user_id | INDEX | 작성자 조회 |

| IDX_TOPIC_STATUS | status | INDEX | 상태별 조회 |

| IDX_TOPIC_CREATED_AT | created_at | INDEX | 최신순 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_TOPIC | PRIMARY KEY | id | 기본키 |

| FK_TOPIC_STUDY | 논리 FK | study_id | [study.id](http://study.id) 참조 |

| FK_TOPIC_USER | 논리 FK | user_id | [user.id](http://user.id) 참조 |

## ENUM

### status

| 값 | 설명 |

|----|------|

| PENDING | 대기 |

| APPROVED | 채택 |

| REJECTED | 반려 |

## 설계 메모

- 모든 회원이 주제를 등록할 수 있다.
- 채택 여부는 관리자가 결정한다.
- 삭제 대신 상태값으로 관리한다.

---

# Table : topic_vote

주제 추천(좋아요) 정보를 저장하는 테이블

## 목적

스터디원이 주제에 추천을 누른 정보를 저장한다.

추천 수는 관리자 채택 시 참고자료로 활용된다.

## 관련 화면

- 주제 제안
- 관리자 > 주제 관리

## 관련 테이블

- topic
- user

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 추천 PK |

| topic_id | BIGINT | | [topic.id](http://topic.id) | ❌ | | | 주제 PK |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 추천 사용자 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 추천일 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_TOPIC_VOTE | id | PRIMARY KEY | 기본키 |

| UQ_TOPIC_VOTE | topic_id,user_id | UNIQUE | 중복 추천 방지 |

| IDX_TOPIC_VOTE_TOPIC | topic_id | INDEX | 주제 조회 |

| IDX_TOPIC_VOTE_USER | user_id | INDEX | 사용자 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_TOPIC_VOTE | PRIMARY KEY | id | 기본키 |

| UQ_TOPIC_VOTE | UNIQUE | topic_id,user_id | 사용자당 1회 추천 |

| FK_TOPIC_VOTE_TOPIC | 논리 FK | topic_id | [topic.id](http://topic.id) 참조 |

| FK_TOPIC_VOTE_USER | 논리 FK | user_id | [user.id](http://user.id) 참조 |

## 설계 메모

- 한 사용자는 동일한 주제에 한 번만 추천 가능하다.
- 추천 취소 시 데이터 삭제가 가능하다.

---

# Table : notice

스터디 공지사항을 저장하는 테이블

## 목적

관리자가 공지사항을 등록하여 스터디원에게 전달한다.

## 관련 화면

- 홈
- 공지사항
- 관리자 > 공지 관리

## 관련 테이블

- study
- user

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 공지 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 PK |

| title | VARCHAR(200) | | | ❌ | | | 공지 제목 |

| content | TEXT | | | ❌ | | | 공지 내용 |

| created_by | BIGINT | | [user.id](http://user.id) | ❌ | | | 작성 관리자 |

| is_pinned | BOOLEAN | | | ❌ | | FALSE | 상단 고정 여부 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_NOTICE | id | PRIMARY KEY | 기본키 |

| IDX_NOTICE_STUDY | study_id | INDEX | 스터디 조회 |

| IDX_NOTICE_CREATED_BY | created_by | INDEX | 작성자 조회 |

| IDX_NOTICE_PINNED | is_pinned | INDEX | 고정공지 조회 |

| IDX_NOTICE_CREATED_AT | created_at | INDEX | 최신순 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_NOTICE | PRIMARY KEY | id | 기본키 |

| FK_NOTICE_STUDY | 논리 FK | study_id | [study.id](http://study.id) 참조 |

| FK_NOTICE_CREATED_BY | 논리 FK | created_by | [user.id](http://user.id) 참조 |

## 설계 메모

- 상단 고정 공지를 지원한다.
- 수정 시 updated_at을 갱신한다.
- 공지는 관리자만 작성할 수 있다.

# Table : vote

스터디에서 진행하는 투표 정보를 관리하는 테이블

## 목적

스터디 운영에 필요한 투표를 생성하고 관리한다.

공지성 투표, 일정 투표, 의견 수렴 등 다양한 용도로 사용할 수 있다.

## 관련 화면

- 홈
- 투표
- 관리자 > 투표 관리

## 관련 테이블

- study
- user
- vote_option
- vote_answer

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 투표 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 PK |

| title | VARCHAR(200) | | | ❌ | | | 투표 제목 |

| description | TEXT | | | ✅ | | | 투표 설명 |

| created_by | BIGINT | | [user.id](http://user.id) | ❌ | | | 작성 관리자 |

| allow_multiple | BOOLEAN | | | ❌ | | FALSE | 복수 선택 허용 여부 |

| is_anonymous | BOOLEAN | | | ❌ | | FALSE | 익명 투표 여부 |

| start_at | DATETIME | | | ❌ | | | 시작일시 |

| end_at | DATETIME | | | ❌ | | | 종료일시 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_VOTE | id | PRIMARY KEY | 기본키 |

| IDX_VOTE_STUDY | study_id | INDEX | 스터디 조회 |

| IDX_VOTE_CREATED_BY | created_by | INDEX | 작성자 조회 |

| IDX_VOTE_END_AT | end_at | INDEX | 종료 예정 조회 |

| IDX_VOTE_CREATED_AT | created_at | INDEX | 최신순 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_VOTE | PRIMARY KEY | id | 기본키 |

| CK_VOTE_PERIOD | CHECK | start_at,end_at | 시작일은 종료일보다 이전이어야 함 |

| FK_VOTE_STUDY | 논리 FK | study_id | [study.id](http://study.id) 참조 |

| FK_VOTE_CREATED_BY | 논리 FK | created_by | [user.id](http://user.id) 참조 |

## 설계 메모

- 복수 선택 여부를 지원한다.
- 익명 투표를 지원한다.
- 진행 상태는 start_at / end_at으로 계산한다.
- 종료 후에도 결과 조회가 가능하다.

---

# Table : vote_option

투표 선택지를 저장하는 테이블

## 목적

하나의 투표에 포함되는 여러 개의 선택지를 저장한다.

## 관련 화면

- 투표
- 관리자 > 투표 관리

## 관련 테이블

- vote
- vote_answer

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 선택지 PK |

| vote_id | BIGINT | | [vote.id](http://vote.id) | ❌ | | | 투표 PK |

| content | VARCHAR(200) | | | ❌ | | | 선택지 내용 |

| sort_order | INT | | | ❌ | | 1 | 표시 순서 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_VOTE_OPTION | id | PRIMARY KEY | 기본키 |

| IDX_VOTE_OPTION_VOTE | vote_id | INDEX | 투표 조회 |

| IDX_VOTE_OPTION_SORT | vote_id,sort_order | INDEX | 표시 순서 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_VOTE_OPTION | PRIMARY KEY | id | 기본키 |

| CK_VOTE_OPTION_SORT | CHECK | sort_order | 1 이상의 값 |

| FK_VOTE_OPTION_VOTE | 논리 FK | vote_id | [vote.id](http://vote.id) 참조 |

## 설계 메모

- 하나의 투표는 여러 개의 선택지를 가진다.
- 화면에서는 sort_order 순으로 출력한다.
- 선택지 삭제 시 vote_answer 무결성을 서비스에서 검증한다.

---

# Table : vote_answer

사용자의 투표 결과를 저장하는 테이블

## 목적

사용자가 어떤 선택지에 투표했는지 저장한다.

## 관련 화면

- 투표
- 관리자 > 투표 결과

## 관련 테이블

- vote
- vote_option
- user

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 투표 결과 PK |

| vote_id | BIGINT | | [vote.id](http://vote.id) | ❌ | | | 투표 PK |

| vote_option_id | BIGINT | | vote_[option.id](http://option.id) | ❌ | | | 선택지 PK |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 사용자 PK |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 투표일시 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_VOTE_ANSWER | id | PRIMARY KEY | 기본키 |

| IDX_VOTE_ANSWER_VOTE | vote_id | INDEX | 투표 조회 |

| IDX_VOTE_ANSWER_OPTION | vote_option_id | INDEX | 선택지 조회 |

| IDX_VOTE_ANSWER_USER | user_id | INDEX | 사용자 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_VOTE_ANSWER | PRIMARY KEY | id | 기본키 |

| UK_VOTE_ANSWER | UNIQUE | vote_option_id,user_id | 동일 선택지 중복 투표 방지 |

| FK_VOTE_ANSWER_VOTE | 논리 FK | vote_id | [vote.id](http://vote.id) 참조 |

| FK_VOTE_ANSWER_OPTION | 논리 FK | vote_option_id | vote_[option.id](http://option.id) 참조 |

| FK_VOTE_ANSWER_USER | 논리 FK | user_id | [user.id](http://user.id) 참조 |

## 설계 메모

- 복수 선택이 허용되지 않는 경우 서비스에서 1건만 저장하도록 검증한다.
- 복수 선택이 허용되면 여러 개의 vote_answer를 저장한다.
- 투표 종료 후 수정은 허용하지 않는다.

# Table : notification

사용자에게 전달되는 알림 정보를 저장하는 테이블

## 목적

서비스 내에서 발생하는 이벤트를 사용자에게 알림으로 전달한다.

과제 등록, 댓글 작성, 공지 등록, 투표 생성 등 다양한 이벤트에 활용된다.

## 관련 화면

- 홈
- 알림

## 관련 테이블

- study
- user

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | 알림 PK |

| study_id | BIGINT | | [study.id](http://study.id) | ❌ | | | 스터디 PK |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 알림 대상 사용자 |

| type | VARCHAR(30) | | | ❌ | | | 알림 유형 |

| title | VARCHAR(200) | | | ❌ | | | 알림 제목 |

| content | TEXT | | | ❌ | | | 알림 내용 |

| target_type | VARCHAR(30) | | | ❌ | | | 이동 대상 타입 |

| target_id | BIGINT | | | ❌ | | | 이동 대상 PK |

| is_read | BOOLEAN | | | ❌ | | FALSE | 읽음 여부 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

| read_at | DATETIME | | | ✅ | | | 읽은 일시 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_NOTIFICATION | id | PRIMARY KEY | 기본키 |

| IDX_NOTIFICATION_USER | user_id | INDEX | 사용자 조회 |

| IDX_NOTIFICATION_STUDY | study_id | INDEX | 스터디 조회 |

| IDX_NOTIFICATION_READ | is_read | INDEX | 읽지 않은 알림 조회 |

| IDX_NOTIFICATION_CREATED_AT | created_at | INDEX | 최신순 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_NOTIFICATION | PRIMARY KEY | id | 기본키 |

| FK_NOTIFICATION_STUDY | 논리 FK | study_id | [study.id](http://study.id) 참조 |

| FK_NOTIFICATION_USER | 논리 FK | user_id | [user.id](http://user.id) 참조 |

## ENUM

### type

| 값 | 설명 |

|----|------|

| ASSIGNMENT | 과제 |

| FEED_COMMENT | 댓글 |

| NOTICE | 공지 |

| VOTE | 투표 |

| SYSTEM | 시스템 |

### target_type

| 값 | 설명 |

|----|------|

| ASSIGNMENT | 과제 |

| FEED | 인증 피드 |

| NOTICE | 공지 |

| VOTE | 투표 |

## 설계 메모

- 읽지 않은 알림을 우선 조회한다.
- 클릭 시 target_type과 target_id를 이용하여 해당 화면으로 이동한다.
- 읽음 처리 시 read_at을 함께 저장한다.

---

# Table : refresh_token

사용자의 Refresh Token을 관리하는 테이블

## 목적

Google OAuth 로그인 이후 발급되는 Refresh Token을 저장한다.

멀티 디바이스 로그인을 지원하기 위해 기기별로 Token을 관리한다.

## 관련 화면

- 로그인

## 관련 테이블

- user

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | PK |

| user_id | BIGINT | | [user.id](http://user.id) | ❌ | | | 사용자 PK |

| refresh_token | VARCHAR(500) | | | ❌ | ✅ | | Refresh Token |

| device_id | VARCHAR(100) | | | ❌ | | | 디바이스 식별값 |

| device_name | VARCHAR(100) | | | ❌ | | | 디바이스 이름 |

| expires_at | DATETIME | | | ❌ | | | 만료일 |

| last_access_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 마지막 사용 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_REFRESH_TOKEN | id | PRIMARY KEY | 기본키 |

| IDX_REFRESH_TOKEN_USER | user_id | INDEX | 사용자 조회 |

| IDX_REFRESH_TOKEN_DEVICE | device_id | INDEX | 기기 조회 |

| IDX_REFRESH_TOKEN_EXPIRES | expires_at | INDEX | 만료 토큰 정리 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_REFRESH_TOKEN | PRIMARY KEY | id | 기본키 |

| UK_REFRESH_TOKEN | UNIQUE | refresh_token | 토큰 중복 방지 |

| FK_REFRESH_TOKEN_USER | 논리 FK | user_id | [user.id](http://user.id) 참조 |

## 설계 메모

- 사용자당 여러 개의 Refresh Token을 저장할 수 있다.
- 로그아웃 시 해당 기기의 Token만 삭제한다.
- 만료된 Token은 Batch로 정리한다.
- device_name은 User-Agent를 기반으로 저장한다.

---

# Table : encouragement_message

홈 화면 응원 문구를 저장하는 테이블

## 목적

홈 화면에서 랜덤으로 노출되는 응원 문구를 관리한다.

관리자가 자유롭게 추가·수정할 수 있다.

## 관련 화면

- 홈
- 관리자 > 응원 문구 관리

## 관련 테이블

- user

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

| id | BIGINT | ✅ | | ❌ | ✅ | AUTO_INCREMENT | PK |

| content | VARCHAR(300) | | | ❌ | | | 응원 문구 |

| is_active | BOOLEAN | | | ❌ | | TRUE | 사용 여부 |

| created_by | BIGINT | | [user.id](http://user.id) | ❌ | | | 등록 관리자 |

| created_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 생성일 |

| updated_at | DATETIME | | | ❌ | | CURRENT_TIMESTAMP | 수정일 |

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_ENCOURAGEMENT_MESSAGE | id | PRIMARY KEY | 기본키 |

| IDX_ENCOURAGEMENT_ACTIVE | is_active | INDEX | 활성 문구 조회 |

| IDX_ENCOURAGEMENT_CREATED_BY | created_by | INDEX | 등록자 조회 |

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_ENCOURAGEMENT_MESSAGE | PRIMARY KEY | id | 기본키 |

| FK_ENCOURAGEMENT_CREATED_BY | 논리 FK | created_by | [user.id](http://user.id) 참조 |

## 설계 메모

- 홈 화면 진입 시 활성 문구 중 하나를 랜덤으로 노출한다.
- 비활성 문구는 랜덤 대상에서 제외한다.
- 관리자는 문구를 자유롭게 추가·수정·비활성화할 수 있다.

---

# 7. 변경 이력

|버전|날짜|내용|

|------|------|------|

|v1.0|2026-07-01|초기 문서 작성|  
|v1.1|2026-07-21|최종 문서 작성|