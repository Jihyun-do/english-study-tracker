package com.jude.englishstudy.common.device;

/**
 * User-Agent 파싱 결과.
 */
public record ParsedDeviceInfo(
        String browser,
        String platform
) {

    public static final String UNKNOWN = "Unknown";

    public static ParsedDeviceInfo unknown() {
        return new ParsedDeviceInfo(UNKNOWN, UNKNOWN);
    }

    /**
     * 사람이 읽기 쉬운 디바이스 이름. (예: Chrome (Windows))
     */
    public String toDisplayName() {
        return browser + " (" + platform + ")";
    }
}
