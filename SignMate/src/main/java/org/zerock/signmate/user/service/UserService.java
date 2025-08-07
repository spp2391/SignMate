package org.zerock.signmate.user.service;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.dto.AddUserRequest;
import org.zerock.signmate.user.repository.UserRepository;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;


    public Long save(AddUserRequest dto){
        BCryptPasswordEncoder encoder= new BCryptPasswordEncoder();
        return userRepository.save(User.builder()
                .email(dto.getEmail())
                //비밀번호 저장시 암호화를 하여 저장, 암호화하지 않으면 로그인 불가
                .password(encoder.encode(dto.getPassword()))
                .build()
         ).getUserId();
    }
    //자동으로 생성되는 1씩 더해지는 user_id로 데이터를 검색
    //token에 저장하는 갑시 user_id이기 땜에 작성
    public User findById(Long userId){
        return userRepository.findById(userId)
                .orElseThrow(()->new IllegalArgumentException("Unexpected user"));

    }
    public User findByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(()->new IllegalArgumentException("Unexpected user"));
    }
}
