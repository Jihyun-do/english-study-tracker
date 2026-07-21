package com.jude.englishstudy.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 기본 설정.
 *
 * <p>현재는 Stateless + URL 기반 접근 제어만 적용한다.
 * 추후 아래 확장 지점에 JWT Filter, OAuth2 Login을 연결한다.</p>
 *
 * <ul>
 *   <li>JWT: {@code http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)}</li>
 *   <li>OAuth2: {@code http.oauth2Login(Customizer.withDefaults())} 또는 커스텀 successHandler</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // REST API — CSRF 비활성화
                .csrf(AbstractHttpConfigurer::disable)

                // CorsConfig Bean 사용
                .cors(Customizer.withDefaults())

                // Session 미사용 (JWT 기반 Stateless 인증 예정)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Form Login / HTTP Basic 미사용 (Google OAuth + JWT 예정)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(SecurityConstants.PUBLIC_URLS).permitAll()
                        .anyRequest().authenticated()
                );

        // TODO: Google OAuth2 Login 연동
        // http.oauth2Login(oauth2 -> oauth2
        //         .successHandler(oAuth2LoginSuccessHandler)
        //         .failureHandler(oAuth2LoginFailureHandler));

        // TODO: JWT 인증 필터 등록 (UsernamePasswordAuthenticationFilter 앞)
        // http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 비밀번호 해시용 Encoder.
     * Google OAuth 전용 서비스이지만, 추후 관리 기능 등에서 사용할 수 있다.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 프로그래밍 방식 인증(JWT 검증 후 SecurityContext 설정 등)에 사용한다.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
