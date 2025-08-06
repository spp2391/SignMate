package org.zerock.signmate.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.zerock.signmate.user.sevice.UserService;

@RequiredArgsConstructor
@Controller
public class UserApiController {
    private final org.zerock.signmate.user.sevice.UserService userService;

//    @PostMapping("/user")
//    public String signup(AddUserRequest request){
//        userService.save(request);/**/
//        return "redirect:/login";
//    }
}
