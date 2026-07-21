package com.jude.englishstudy.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.jude.englishstudy.domain.repository")
@EntityScan(basePackages = "com.jude.englishstudy.domain.entity")
public class JpaConfig {
}
