package org.zerock.signmate.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.zerock.signmate.config.jwt.TokenProvider;
import org.zerock.signmate.config.oauth.OAuth2AuthorizationRequestBasedOnCookieRepository;
import org.zerock.signmate.config.oauth.OAuth2SuccessHandler;
import org.zerock.signmate.config.oauth.OAuth2UserCustomService;
import org.zerock.signmate.user.repository.RefreshTokenRepository;
import org.zerock.signmate.user.service.UserService;

import java.util.List;

@RequiredArgsConstructor
@Configuration
public class WebOAuthSecurityConfig {
    private final OAuth2UserCustomService oAuth2UserCustomService;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;

    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                // /h2-console의 접속에 스프링 시큐리티를 해제
//                .requestMatchers(toH2Console())
                /*,requestMachers(new AntPathMatcher("/static/**"));*/
                //resources/static폴더 접속에 스프링 시큐리티 해제
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    @Bean
   public SecurityFilterChain filterChain(HttpSecurity http, OAuth2SuccessHandler oAuth2SuccessHandler) throws Exception {
        return http
                .cors(cors -> cors
                        .configurationSource(corsConfigurationSource()))
                //csrf설정 끄기
                .csrf(AbstractHttpConfigurer::disable)
                //로그인 시 id와 pw를 base64로 인코딩하여 전달하는 설정 끄지
                .httpBasic(AbstractHttpConfigurer::disable)
//                //JWT를 이용한  로그인을 사용하고 일반로그인 끄기
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                //세션 사용하지 않도록 설정
                .sessionManagement(management ->management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                //addFilterBefor(필터1, 필터2)
                //필터2가 실행되기 전 필터1을 실행하도록 추가하는 메서드
                .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
//                .formLogin(form -> form
//                        .loginPage("/api/user/login")
//                        .defaultSuccessUrl("/", true) // ✅ 수정됨: 로그인 성공 시 관리자 페이지로 이동
//                        .failureUrl("/?error=true")
//                        .permitAll()
//                )
                .authorizeRequests(auth-> auth
                        //아무런 권한이 없어도 실행 가능한 Mapping설정
                        .requestMatchers("/api/token","/api/user/**", "/api/image/**").permitAll()
                        //로그인을 해야만 실행 가능한 매핑
                        .requestMatchers("/api/**").authenticated()
                        //위 두개를 제외한 모든 mapping은 권한 없어도 실행가능하도록
                        .anyRequest().permitAll())
                .oauth2Login(oauth2 -> oauth2.loginPage("/login")
                        //로그인 처리를 실행할 서비스를 설정
                        .authorizationEndpoint(authorizationEndpoint -> authorizationEndpoint.authorizationRequestRepository(
                                oAuth2AuthoriztionRequestBasedOnCookieRepository()))
                        .userInfoEndpoint(userInfoEndpoint ->userInfoEndpoint.userService(oAuth2UserCustomService))
                        .successHandler(oAuth2SuccessHandler())
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                                new AntPathRequestMatcher("/api/**")
                        ))
                .build();
    }
    @Bean
    public OAuth2SuccessHandler oAuth2SuccessHandler(){
        return new OAuth2SuccessHandler(tokenProvider,
                refreshTokenRepository,
                oAuth2AuthoriztionRequestBasedOnCookieRepository(),
                userService
        );
    }

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter(){
        return new TokenAuthenticationFilter(tokenProvider);
    }
    @Bean
    public OAuth2AuthorizationRequestBasedOnCookieRepository oAuth2AuthoriztionRequestBasedOnCookieRepository(){
        return new OAuth2AuthorizationRequestBasedOnCookieRepository();
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 프론트에서 withCredentials: true 쓸 경우 필요
        config.addExposedHeader("accessToken");
        config.addExposedHeader("refreshToken");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
