package com.jude.englishstudy.auth.oauth;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.assertj.core.api.Assertions.assertThat;

class DeviceInfoResolverTest {

    private DeviceInfoResolver deviceInfoResolver;

    @BeforeEach
    void setUp() {
        deviceInfoResolver = new DeviceInfoResolver();
    }

    @Test
    @DisplayName("요청 파라미터에서 device 정보를 추출한다")
    void resolveFromRequestParameter() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setParameter(DeviceInfoResolver.DEVICE_ID_PARAM, "device-param");
        request.setParameter(DeviceInfoResolver.DEVICE_NAME_PARAM, "Safari");

        DeviceInfo deviceInfo = deviceInfoResolver.resolve(request);

        assertThat(deviceInfo.deviceId()).isEqualTo("device-param");
        assertThat(deviceInfo.deviceName()).isEqualTo("Safari");
    }

    @Test
    @DisplayName("deviceId 파라미터가 없으면 cookie를 사용한다")
    void resolveFromCookie() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie(DeviceInfoResolver.DEVICE_ID_COOKIE, "device-cookie"));
        request.addHeader("User-Agent", "Chrome");

        DeviceInfo deviceInfo = deviceInfoResolver.resolve(request);

        assertThat(deviceInfo.deviceId()).isEqualTo("device-cookie");
        assertThat(deviceInfo.deviceName()).isEqualTo("Chrome");
    }

    @Test
    @DisplayName("device 정보가 없으면 기본값을 사용한다")
    void resolveDefaultValues() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        DeviceInfo deviceInfo = deviceInfoResolver.resolve(request);

        assertThat(deviceInfo.deviceId()).isNotBlank();
        assertThat(deviceInfo.deviceName()).isEqualTo("unknown");
    }
}
