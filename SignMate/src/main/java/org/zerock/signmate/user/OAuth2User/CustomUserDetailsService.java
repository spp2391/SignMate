package org.zerock.signmate.user.OAuth2User;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.repository.UserRepository;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));

        if (user.getUserType() == null) {
            throw new UsernameNotFoundException("❌ 권한이 설정되지 않은 사용자입니다: " + email);
        }

        System.out.println("✅ 로그인한 사용자: " + user.getEmail());
        System.out.println("✅ DB role 값: " + user.getUserType());
        System.out.println("✅ 최종 적용 권한: ROLE_" + user.getUserType());

        return new CustomOAuth2User(user);
    }
}
