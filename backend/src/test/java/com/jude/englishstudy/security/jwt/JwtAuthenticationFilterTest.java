package com.jude.englishstudy.security.jwt;

import com.jude.englishstudy.security.config.PublicPathMatcher;
import com.jude.englishstudy.security.principal.CustomUserPrincipal;
import com.jude.englishstudy.security.service.CustomUserDetailsService;
import io.jsonwebtoken.Claims;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private PublicPathMatcher publicPathMatcher;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

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
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        assertThat(filterChain.getRequest()).isNotNull();
    }

    @Test
    @DisplayName("유효한 Access Token이면 SecurityContext에 Authentication을 설정한다")
    void doFilterWithValidToken() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/assignments");
        request.addHeader("Authorization", "Bearer valid.token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        Claims claims = mock(Claims.class);
        CustomUserPrincipal principal = createPrincipal();

        when(claims.get(JwtConstants.CLAIM_TOKEN_TYPE, String.class)).thenReturn(TokenType.ACCESS.name());
        when(jwtTokenProvider.getClaims("valid.token")).thenReturn(claims);
        when(jwtTokenProvider.getUserId("valid.token")).thenReturn(1L);
        when(customUserDetailsService.loadUserById(1L)).thenReturn(principal);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        assertThat(authentication).isNotNull();
        assertThat(authentication.getPrincipal()).isEqualTo(principal);
        assertThat(authentication.getCredentials()).isNull();
        assertThat(authentication.getAuthorities()).containsExactly(new SimpleGrantedAuthority("ROLE_MEMBER"));
        assertThat(authentication.getDetails()).isNotNull();
        assertThat(filterChain.getRequest()).isNotNull();
    }

    @Test
    @DisplayName("Bearer Token 추출 시 trim을 적용한다")
    void extractAccessTokenWithTrim() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/assignments");
        request.addHeader("Authorization", "Bearer   valid.token   ");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        Claims claims = mock(Claims.class);
        CustomUserPrincipal principal = createPrincipal();

        when(claims.get(JwtConstants.CLAIM_TOKEN_TYPE, String.class)).thenReturn(TokenType.ACCESS.name());
        when(jwtTokenProvider.getClaims("valid.token")).thenReturn(claims);
        when(jwtTokenProvider.getUserId("valid.token")).thenReturn(1L);
        when(customUserDetailsService.loadUserById(1L)).thenReturn(principal);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(jwtTokenProvider).getClaims("valid.token");
        verify(jwtTokenProvider).getUserId("valid.token");
    }

    @Test
    @DisplayName("JWT 예외는 Filter에서 삼키지 않고 전파한다")
    void propagateJwtTokenException() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/assignments");
        request.addHeader("Authorization", "Bearer invalid.token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        when(jwtTokenProvider.getClaims("invalid.token"))
                .thenThrow(new JwtTokenException(JwtErrorCode.INVALID));

        assertThatThrownBy(() -> jwtAuthenticationFilter.doFilterInternal(request, response, filterChain))
                .isInstanceOf(JwtTokenException.class);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    private CustomUserPrincipal createPrincipal() {
        CustomUserPrincipal principal = mock(CustomUserPrincipal.class);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_MEMBER"))).when(principal).getAuthorities();
        return principal;
    }
}
