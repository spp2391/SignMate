package org.zerock.signmate.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class UserApiController {
    private final org.zerock.signmate.user.service.UserService userService;

//    @PostMapping("/user")
//    public String signup(AddUserRequest request){
//        userService.save(request);/**/
//        return "redirect:/login";
//    }
}
