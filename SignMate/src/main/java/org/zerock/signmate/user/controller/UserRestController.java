package org.zerock.signmate.user.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.signmate.config.jwt.TokenProvider;
import org.zerock.signmate.user.OAuth2User.CustomOAuth2User;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.dto.AddUserRequest;
import org.zerock.signmate.user.dto.LoginUserRequest;
import org.zerock.signmate.user.service.UserRegisterService;
import org.zerock.signmate.user.service.UserService;

import java.security.Principal;
import java.time.Duration;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserRestController {
    private final UserService userService;
    private final UserRegisterService userRegisterService;
    private final TokenProvider tokenProvider;

    // 회원가입, 로그인, 로그아웃 기능
    @PostMapping("/join")
    public ResponseEntity<String> register(@Valid @RequestBody AddUserRequest dto,
                                           BindingResult bindingResult ) {
        if (bindingResult.hasErrors()) {
            bindingResult.getAllErrors().forEach(error -> System.out.println(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body("fail");
        }
        try{
            User newUser = userRegisterService.register(dto);
//            session.setAttribute("userId", newUser.getUserId());
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("fail");
        }
    }

    @PostMapping(value="/login",consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@Valid @RequestBody LoginUserRequest dto,
                                        BindingResult bindingResult, HttpServletResponse response) {
        if (bindingResult.hasErrors()) {
            bindingResult.getAllErrors().forEach(error -> System.out.println(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body("fail");
        }
        try {
            User loginUser = userRegisterService.findUserByEmailAndPassword(dto);
            Authentication authentication = new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String accessToken = tokenProvider.generateToken(loginUser, Duration.ofDays(1));
            String refreshToken = tokenProvider.generateToken(loginUser, Duration.ofDays(14));
            Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(14*60*60);
            response.addCookie(cookie);

            return ResponseEntity.ok(accessToken);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body("User not found");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("fail");
        }
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

    @PostMapping("/checklogin")
    public ResponseEntity<String> checkLogin(@AuthenticationPrincipal CustomOAuth2User user) {
        if(user==null){

            return ResponseEntity.ok().body("");
        } else {
            return ResponseEntity.ok(user.getUser().getUsername());
        }
    }

    @PostMapping("/checkloginuser")
    public ResponseEntity<User> checkLoginUser(@AuthenticationPrincipal CustomOAuth2User user) {
        return ResponseEntity.ok(user.getUser());
    }
}
