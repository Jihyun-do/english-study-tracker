package com.jude.englishstudy;

import com.jude.englishstudy.config.AppProperties;
import com.jude.englishstudy.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties({JwtProperties.class, AppProperties.class})
public class EnglishStudyApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnglishStudyApplication.class, args);
    }
}
