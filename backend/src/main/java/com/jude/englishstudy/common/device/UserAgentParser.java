package com.jude.englishstudy.common.device;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import ua_parser.Client;
import ua_parser.Parser;

/**
 * User-Agent 문자열을 브라우저·OS 정보로 파싱한다.
 * RefreshToken device_name, 로그인 이력, 보안 기능 등에서 재사용한다.
 */
@Component
public class UserAgentParser {

    public static final int MAX_DEVICE_NAME_LENGTH = 100;
    public static final String DEFAULT_DEVICE_NAME = ParsedDeviceInfo.UNKNOWN;

    private final Parser parser = new Parser();

    /**
     * User-Agent를 파싱하여 브라우저와 플랫폼 정보를 반환한다.
     */
    public ParsedDeviceInfo parse(String userAgent) {
        if (!StringUtils.hasText(userAgent)) {
            return ParsedDeviceInfo.unknown();
        }

        try {
            Client client = parser.parse(userAgent);
            String browser = normalizeBrowser(client.userAgent.family);
            String platform = normalizePlatform(client);
            return new ParsedDeviceInfo(browser, platform);
        } catch (RuntimeException exception) {
            return ParsedDeviceInfo.unknown();
        }
    }

    /**
     * User-Agent를 사람이 읽기 쉬운 device_name으로 변환한다.
     * User-Agent가 아니거나 비어 있으면 null을 반환한다.
     */
    public String toDisplayName(String userAgent) {
        if (!StringUtils.hasText(userAgent)) {
            return null;
        }

        if (!looksLikeUserAgent(userAgent)) {
            return truncate(userAgent.trim());
        }

        return truncate(parse(userAgent).toDisplayName());
    }

    /**
     * 요청 파라미터 등 외부에서 전달된 device_name을 정규화한다.
     * User-Agent 전체 문자열이면 파싱하고, 이미 짧은 이름이면 길이만 제한한다.
     */
    public String normalizeDeviceName(String rawDeviceName) {
        if (!StringUtils.hasText(rawDeviceName)) {
            return null;
        }

        String trimmed = rawDeviceName.trim();
        if (looksLikeUserAgent(trimmed)) {
            return truncate(parse(trimmed).toDisplayName());
        }

        return truncate(trimmed);
    }

    private boolean looksLikeUserAgent(String value) {
        return value.contains("Mozilla/")
                || value.contains("AppleWebKit/")
                || value.length() > MAX_DEVICE_NAME_LENGTH;
    }

    private String normalizeBrowser(String browserFamily) {
        if (!StringUtils.hasText(browserFamily) || "Other".equalsIgnoreCase(browserFamily)) {
            return ParsedDeviceInfo.UNKNOWN;
        }

        if (browserFamily.startsWith("IE")) {
            return "Internet Explorer";
        }

        if ("Mobile Safari".equalsIgnoreCase(browserFamily)) {
            return "Safari";
        }

        if (browserFamily.endsWith(" Mobile")) {
            return browserFamily.substring(0, browserFamily.length() - " Mobile".length());
        }

        return browserFamily;
    }

    private String normalizePlatform(Client client) {
        String deviceFamily = client.device.family;
        if ("iPhone".equalsIgnoreCase(deviceFamily)) {
            return "iPhone";
        }
        if ("iPad".equalsIgnoreCase(deviceFamily)) {
            return "iPad";
        }

        String osFamily = client.os.family;
        if (!StringUtils.hasText(osFamily) || "Other".equalsIgnoreCase(osFamily)) {
            return ParsedDeviceInfo.UNKNOWN;
        }

        return normalizeOsFamily(osFamily);
    }

    private String normalizeOsFamily(String osFamily) {
        return switch (osFamily) {
            case "Mac OS X", "macOS" -> "Mac";
            case "Windows" -> "Windows";
            case "Android" -> "Android";
            case "iOS" -> "iPhone";
            case "Chrome OS" -> "Chrome OS";
            case "Linux" -> "Linux";
            default -> osFamily;
        };
    }

    private String truncate(String value) {
        if (value.length() <= MAX_DEVICE_NAME_LENGTH) {
            return value;
        }

        return value.substring(0, MAX_DEVICE_NAME_LENGTH);
    }
}
