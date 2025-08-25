package org.zerock.signmate.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.signmate.user.OAuth2User.CustomOAuth2User;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.dto.AddUserRequest;
import org.zerock.signmate.user.dto.EditUserRequest;
import org.zerock.signmate.user.dto.LoginUserRequest;
import org.zerock.signmate.user.repository.UserRepository;

@RequiredArgsConstructor
@Service
public class UserRegisterService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    @Transactional
    public User register(AddUserRequest dto) throws Exception {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // UserService.register 내부에서
        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .nickname(dto.getNickname())
                .name(dto.getName())
                .userType("USER") // ✅ 기본값 설정
                .userRole("USER")
                .companyName(dto.getCompanyName())
                .build();

        return userRepository.save(user);
    }

    public User editUser(CustomOAuth2User user, EditUserRequest dto) throws Exception {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User userPrimary = user.getUser();
//        User userEdit = User.builder()
//                .userId(userPrimary.getUserId())
//                .name(dto.getName()!=null ? dto.getName() : userPrimary.getName())
//                .nickname(dto.getNickname()!=null ? dto.getNickname() : userPrimary.getNickname())
//                .password(dto.getPassword()!=null ? passwordEncoder.encode(dto.getPassword()) : userPrimary.getPassword())
//                .


        return null;

    }

    public User findUserByEmailAndPassword(LoginUserRequest dto) throws Exception{
//        User user = userRepository.findByEmailAndPassword(dto.getEmail(), passwordEncoder.encode(dto.getPassword())).orElseThrow(
//                () -> new UsernameNotFoundException("user not found.")
//        );
        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow(
                () -> new UsernameNotFoundException("User not found.")
        );
        if(!passwordEncoder.matches(dto.getPassword(),user.getPassword())){
            throw new UsernameNotFoundException("Wrong password.");
        }
//        UserDetails user = customUserDetailsService.loadUserByUsername(dto.getEmail());
        return user;
    }

}
