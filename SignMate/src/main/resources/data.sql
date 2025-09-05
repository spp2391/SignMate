-- -- 1. 먼저 user 데이터 넣기
INSERT ignore INTO user (user_id, name, nickname, email, password, company_name, user_type, regdate, moddate, deleted, kakao_id)
VALUES
    (1, '김철수', '철수', '1@naver.com', '$2a$10$hQrjSLeH4wR8KoHv2u0cIOmW9ULZA3Tgd9hwTNe7i9kMkaqWGpmyC', '철수컴퍼니', 'ADMIN', NOW(), NOW(), false, NULL),
    (2, '이영희', '영희', '2@naver.com', '$2a$10$hQrjSLeH4wR8KoHv2u0cIOmW9ULZA3Tgd9hwTNe7i9kMkaqWGpmyC', '영희상사', 'USER', NOW(), NOW(), false, NULL),
    (3, '박민수', '민수', '3@naver.com', '$2a$10$hQrjSLeH4wR8KoHv2u0cIOmW9ULZA3Tgd9hwTNe7i9kMkaqWGpmyC', '민수무역', 'USER', NOW(), NOW(), false, NULL),
    (4, '최지현', '지현', '4@naver.com', '$2a$10$hQrjSLeH4wR8KoHv2u0cIOmW9ULZA3Tgd9hwTNe7i9kMkaqWGpmyC', '지현디자인', 'USER', NOW(), NOW(), false, NULL),
    (5, '정하늘', '하늘', '5@naver.com', '$2a$10$hQrjSLeH4wR8KoHv2u0cIOmW9ULZA3Tgd9hwTNe7i9kMkaqWGpmyC', '하늘IT', 'ADMIN', NOW(), NOW(), false, NULL);
--
-- -- 2. 그 다음 contract 데이터 넣기
-- INSERT INTO contract (contract_type, writer_id, created_at, updated_at)
-- VALUES
--     ('SERVICE', 1, NOW(), NOW()),
--     ('EMPLOYMENT', 2, NOW(), NOW()),
--     ('SERVICE', 3, NOW(), NOW()),
--     ('SERVICE', 1, NOW(), NOW()),
--     ('EMPLOYMENT', 4, NOW(), NOW());
