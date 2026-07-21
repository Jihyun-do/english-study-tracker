package com.jude.englishstudy.security.jwt;

import com.jude.englishstudy.security.config.PublicPathMatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private PublicPathMatcher publicPathMatcher;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("PUBLIC URL은 shouldNotFilter에서 제외된다")
    void shouldNotFilterPublicPath() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/health");
        when(publicPathMatcher.matchesPublicPath(request)).thenReturn(true);

        assertThat(jwtAuthenticationFilter.shouldNotFilter(request)).isTrue();
    }

    @Test
    @DisplayName("보호 URL은 필터를 통과한다")
    void shouldFilterProtectedPath() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/assignments");
        when(publicPathMatcher.matchesPublicPath(request)).thenReturn(false);

        assertThat(jwtAuthenticationFilter.shouldNotFilter(request)).isFalse();
    }

    @Test
    @DisplayName("Bearer Token이 없으면 JwtTokenProvider를 호출하지 않는다")
    void doFilterWithoutToken() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/assignments");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(jwtTokenProvider, never()).getClaims(any());
        assertThat(filterChain.getRequest()).isNotNull();
    }

    @Test
    @DisplayName("Bearer Token 추출 시 trim을 적용한다")
    void extractAccessTokenWithTrim() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/assignments");
        request.addHeader("Authorization", "Bearer   invalid.token.value   ");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        when(jwtTokenProvider.getClaims("invalid.token.value"))
                .thenThrow(new JwtTokenException(JwtErrorCode.INVALID));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(jwtTokenProvider).getClaims("invalid.token.value");
    }
}
