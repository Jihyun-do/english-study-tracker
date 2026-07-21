package com.jude.englishstudy.common.device;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

class UserAgentParserTest {

    private UserAgentParser userAgentParser;

    @BeforeEach
    void setUp() {
        userAgentParser = new UserAgentParser();
    }

    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 | Chrome (Windows)
            Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0 | Edge (Windows)
            Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0 | Firefox (Windows)
            Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15 | Safari (Mac)
            Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1 | Safari (iPhone)
            Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36 | Chrome (Android)
            """)
    @DisplayName("User-Agent를 사람이 읽기 쉬운 device_name으로 변환한다")
    void toDisplayName(String userAgent, String expected) {
        assertThat(userAgentParser.toDisplayName(userAgent)).isEqualTo(expected);
    }

    @Test
    @DisplayName("device_name 길이는 100자를 초과하지 않는다")
    void maxLength() {
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                + "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";

        String displayName = userAgentParser.toDisplayName(userAgent);

        assertThat(displayName).isNotNull();
        assertThat(displayName.length()).isLessThanOrEqualTo(UserAgentParser.MAX_DEVICE_NAME_LENGTH);
    }

    @Test
    @DisplayName("이미 짧은 device_name은 그대로 사용한다")
    void normalizeShortDeviceName() {
        assertThat(userAgentParser.normalizeDeviceName("Chrome (Windows)"))
                .isEqualTo("Chrome (Windows)");
    }

    @Test
    @DisplayName("User-Agent 형태의 device_name 파라미터는 파싱한다")
    void normalizeUserAgentDeviceName() {
        String userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                + "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";

        assertThat(userAgentParser.normalizeDeviceName(userAgent)).isEqualTo("Chrome (Windows)");
    }

    @Test
    @DisplayName("빈 User-Agent는 null을 반환한다")
    void blankUserAgent() {
        assertThat(userAgentParser.toDisplayName(null)).isNull();
        assertThat(userAgentParser.toDisplayName("")).isNull();
    }
}
