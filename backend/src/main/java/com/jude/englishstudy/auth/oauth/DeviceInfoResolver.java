package com.jude.englishstudy.auth.oauth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.UUID;

/**
 * OAuth2 callback 요청에서 deviceId/deviceName을 추출한다.
 */
@Component
public class DeviceInfoResolver {

    static final String DEVICE_ID_PARAM = "device_id";
    static final String DEVICE_ID_COOKIE = "device_id";
    static final String DEVICE_NAME_PARAM = "device_name";

    public DeviceInfo resolve(HttpServletRequest request) {
        String deviceId = firstNonBlank(
                request.getParameter(DEVICE_ID_PARAM),
                getCookieValue(request, DEVICE_ID_COOKIE),
                UUID.randomUUID().toString()
        );

        String deviceName = firstNonBlank(
                request.getParameter(DEVICE_NAME_PARAM),
                request.getHeader(HttpHeaders.USER_AGENT),
                "unknown"
        );

        return new DeviceInfo(deviceId, deviceName);
    }

    private String getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName()) && StringUtils.hasText(cookie.getValue())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value;
            }
        }

        return null;
    }
}
