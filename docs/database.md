# Jude's English Study Database Design

> Version: v1.0  

> Last Updated: 2026-07-01

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

## Table : study

> 스터디 기본 정보를 관리하는 테이블

## 목적

스터디 기본 정보를 관리한다.

현재는 단일 스터디를 운영하지만 향후 다중 스터디(Multi Study)를 고려하여 설계하였다.

---

## 관련 화면

- 로그인

- 홈

- 관리자 > 스터디 관리

---

## 관련 테이블

- user

- study_member

- assignment

- notice

- file

---

## 컬럼

| 컬럼 | 타입 | PK | FK | NULL | UNIQUE | 기본값 | 설명 |

|------|------|----|----|------|--------|--------|------|

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

---

## 인덱스

| 인덱스명 | 컬럼 | 종류 | 목적 |

|----------|------|------|------|

| PK_STUDY | id | PRIMARY KEY | 스터디 PK |

| UK_STUDY_INVITE_CODE | invite_code | UNIQUE | 초대코드 중복 방지 |

| IDX_STUDY_OWNER_USER_ID | owner_user_id | INDEX | 스터디장 조회 성능 향상 |

| IDX_STUDY_STATUS | status | INDEX | 활성/비활성 스터디 조회 |

| IDX_STUDY_START_DATE | start_date | INDEX | 시작일 기준 조회 및 통계 |

---

## 제약조건

| 제약조건명 | 타입 | 컬럼 | 내용 |

|------------|------|------|------|

| PK_STUDY | PRIMARY KEY | id | 기본키 |

| UK_STUDY_INVITE_CODE | UNIQUE | invite_code | 초대코드는 중복 불가 |

| CK_STUDY_MAX_MEMBER_COUNT | CHECK | max_member_count | 0보다 큰 값만 허용 |

| FK_STUDY_OWNER_USER | 논리 FK | owner_user_id | [user.id](http://user.id) 참조 (물리 FK 생성 안 함) |

| FK_STUDY_LOGO_FILE | 논리 FK | logo_file_id | [file.id](http://file.id) 참조 (물리 FK 생성 안 함) |

---

## ENUM

### status

| 값 | 설명 |

|----|------|

| ACTIVE | 운영 중 |

| INACTIVE | 운영 종료 |

---

## 설계 메모

- 현재 서비스는 단일 스터디를 운영하지만 향후 다중 스터디 확장을 고려하여 설계하였다.

- `invite_code`를 이용한 초대코드 가입 방식을 사용한다.

- `start_date`는 홈 화면의 D+N 및 N주차 계산에 활용한다.

- `logo_file_id`는 공통 `file` 테이블을 참조하여 대표 이미지를 관리한다.

- `status`는 Enum(`ACTIVE`, `INACTIVE`)으로 관리하며, 삭제 대신 상태 변경을 우선 사용한다.

- 모든 FK는 논리 FK만 사용하며, 데이터 무결성은 Spring Boot(Service Layer)에서 검증한다.







---

# 7. 변경 이력

|버전|날짜|내용|

|------|------|------|

|v1.0|2026-07-01|초기 문서 작성|