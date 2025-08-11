-- 1. 먼저 user 데이터 넣기
INSERT INTO user (user_id, name, nickname, email, password, company_name, user_type, regdate, moddate, deleted, kakao_id)
VALUES
    (1, '김철수', '철수', 'chulsoo@example.com', 'password1', '철수컴퍼니', 'ADMIN', NOW(), NOW(), false, NULL),
    (2, '이영희', '영희', 'younghee@example.com', 'password2', '영희상사', 'USER', NOW(), NOW(), false, NULL),
    (3, '박민수', '민수', 'minsoo@example.com', 'password3', '민수무역', 'USER', NOW(), NOW(), false, NULL),
    (4, '최지현', '지현', 'jihyun@example.com', 'password4', '지현디자인', 'USER', NOW(), NOW(), false, NULL),
    (5, '정하늘', '하늘', 'haneul@example.com', 'password5', '하늘IT', 'ADMIN', NOW(), NOW(), false, NULL);

-- 2. 그 다음 contract 데이터 넣기
INSERT INTO contract (contract_type, writer_id, created_at, updated_at)
VALUES
    ('SERVICE', 1, NOW(), NOW()),
    ('EMPLOYMENT', 2, NOW(), NOW()),
    ('SERVICE', 3, NOW(), NOW()),
    ('SERVICE', 1, NOW(), NOW()),
    ('EMPLOYMENT', 4, NOW(), NOW());
