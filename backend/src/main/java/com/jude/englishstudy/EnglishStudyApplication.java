package com.jude.englishstudy;

import com.jude.englishstudy.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class EnglishStudyApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnglishStudyApplication.class, args);
    }
}
