package org.zerock.signmate.user.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.signmate.user.domain.User;
import org.zerock.signmate.user.dto.AddUserRequest;
import org.zerock.signmate.user.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserRestController {
    private final UserService userService;

    // 회원가입, 로그인, 로그아웃 기능
    @PostMapping("/join")
    public ResponseEntity<String> register(@Valid @RequestBody AddUserRequest dto,
                                           BindingResult bindingResult, HttpSession session ) {
        if (bindingResult.hasErrors()) {
            bindingResult.getAllErrors().forEach(error -> System.out.println(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body("fail");
        }
        try{
            User newUser = userService.register(dto);
            session.setAttribute("userId", newUser.getUserId());
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("fail");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody AddUserRequest dto,
                                        BindingResult bindingResult, HttpSession session) {
        if (bindingResult.hasErrors()) {
            bindingResult.getAllErrors().forEach(error -> System.out.println(error.getDefaultMessage()));
            return ResponseEntity.badRequest().body("fail");
        }
        try {
            User loginUser = userService.findUserByEmail(dto.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            session.setAttribute("userId", loginUser.getUserId());
            return ResponseEntity.ok("success");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.badRequest().body("User not found");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("fail");
        }
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }

}
