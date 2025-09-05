package org.zerock.signmate.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Controller
public class UserApiController {
    private final org.zerock.signmate.user.service.UserService userService;

    @Controller
    public class HomeController {
        @GetMapping("/")
        public String index() {
            return "index";  // src/main/resources/templates/index.html (Thymeleaf 등)
        }
    }
//    @PostMapping("/user")
//    public String signup(AddUserRequest request){
//        userService.save(request);/**/
//        return "redirect:/login";
//    }
}
