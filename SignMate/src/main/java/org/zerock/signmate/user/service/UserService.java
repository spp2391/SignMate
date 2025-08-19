package org.zerock.signmate.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.user.OAuth2User.CustomUserDetailsService;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.dto.AddUserRequest;
import org.zerock.signmate.user.dto.LoginUserRequest;
import org.zerock.signmate.user.repository.UserRepository;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;
//    private final PasswordEncoder passwordEncoder;

    // 회원가입
//    @Transactional
//    public User register(AddUserRequest dto) throws Exception {
//        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
//            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
//        }
//
//        // UserService.register 내부에서
//        User user = User.builder()
//                .email(dto.getEmail())
//                .password(passwordEncoder.encode(dto.getPassword()))
//                .nickname(dto.getNickname())
//                .name(dto.getName())
//                .userType("USER") // ✅ 기본값 설정
//                .userRole("USER")
//                .companyName(dto.getCompanyName())
//                .build();
//
//        return userRepository.save(user);
//    }

//    public User findUserByEmailAndPassword(LoginUserRequest dto) throws Exception{
//        User user = userRepository.findByEmailAndPassword(dto.getEmail(), passwordEncoder.encode(dto.getPassword())).orElseThrow(
//                () -> new UsernameNotFoundException("user not found.")
//        );
////        UserDetails user = customUserDetailsService.loadUserByUsername(dto.getEmail());
//        return user;
//    }
/*
    public Long save(AddUserRequest dto){
        BCryptPasswordEncoder encoder= new BCryptPasswordEncoder();
        return userRepository.save(User.builder()
                .email(dto.getEmail())
                //비밀번호 저장시 암호화를 하여 저장, 암호화하지 않으면 로그인 불가
                .password(encoder.encode(dto.getPassword()))
                .build()
         ).getUserId();
    }*/
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
