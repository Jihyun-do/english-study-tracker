package com.jude.englishstudy.auth.oauth;

/**
 * RefreshToken 저장에 사용하는 기기 정보.
 */
public record DeviceInfo(
        String deviceId,
        String deviceName
) {
}
