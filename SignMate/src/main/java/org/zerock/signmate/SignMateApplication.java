package org.zerock.signmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SignMateApplication {

    public static void main(String[] args) {
        SpringApplication.run(SignMateApplication.class, args);
    }

}
