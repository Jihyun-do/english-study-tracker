package com.jude.englishstudy.security.jwt;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

/**
 * JWT 설정 값.
 * Spring Boot {@link Duration} 바인딩을 사용한다. (예: 30m, 1h, 14d)
 */
@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    @NotBlank
    @Size(min = 32, message = "jwt.secret must be at least 32 characters")
    private String secret;

    @NotNull
    private Duration accessTokenExpiration;

    @NotNull
    private Duration refreshTokenExpiration;
}
