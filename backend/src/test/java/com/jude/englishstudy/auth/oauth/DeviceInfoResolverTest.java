package com.jude.englishstudy.auth.oauth;

import com.jude.englishstudy.common.device.UserAgentParser;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.assertj.core.api.Assertions.assertThat;

class DeviceInfoResolverTest {

    private static final String CHROME_WINDOWS_UA =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    + "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";

    private DeviceInfoResolver deviceInfoResolver;

    @BeforeEach
    void setUp() {
        deviceInfoResolver = new DeviceInfoResolver(new UserAgentParser());
    }

    @Test
    @DisplayName("요청 파라미터에서 device 정보를 추출한다")
    void resolveFromRequestParameter() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter(DeviceInfoResolver.DEVICE_ID_PARAM, "device-param");
        request.setParameter(DeviceInfoResolver.DEVICE_NAME_PARAM, "Safari (Mac)");

        DeviceInfo deviceInfo = deviceInfoResolver.resolve(request);

        assertThat(deviceInfo.deviceId()).isEqualTo("device-param");
        assertThat(deviceInfo.deviceName()).isEqualTo("Safari (Mac)");
    }

    @Test
    @DisplayName("device_name이 없으면 User-Agent를 파싱한다")
    void resolveFromUserAgent() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie(DeviceInfoResolver.DEVICE_ID_COOKIE, "device-cookie"));
        request.addHeader("User-Agent", CHROME_WINDOWS_UA);

        DeviceInfo deviceInfo = deviceInfoResolver.resolve(request);

        assertThat(deviceInfo.deviceId()).isEqualTo("device-cookie");
        assertThat(deviceInfo.deviceName()).isEqualTo("Chrome (Windows)");
    }

    @Test
    @DisplayName("device 정보가 없으면 기본값을 사용한다")
    void resolveDefaultValues() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        DeviceInfo deviceInfo = deviceInfoResolver.resolve(request);

        assertThat(deviceInfo.deviceId()).isNotBlank();
        assertThat(deviceInfo.deviceName()).isEqualTo(UserAgentParser.DEFAULT_DEVICE_NAME);
    }
}
