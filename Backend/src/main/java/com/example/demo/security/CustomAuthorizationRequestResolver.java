package com.example.demo.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Thêm prompt=select_account vào mỗi OAuth2 request gửi đến Google.
 * Mục đích: Luôn hiện màn hình chọn tài khoản Google, không tự đăng nhập account đang lưu sẵn.
 */
public class CustomAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver defaultResolver;

    public CustomAuthorizationRequestResolver(ClientRegistrationRepository repo, String baseUri) {
        this.defaultResolver = new DefaultOAuth2AuthorizationRequestResolver(repo, baseUri);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest req = defaultResolver.resolve(request);
        return addPromptParam(req);
    }

    @Override
    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        OAuth2AuthorizationRequest req = defaultResolver.resolve(request, clientRegistrationId);
        return addPromptParam(req);
    }

    private OAuth2AuthorizationRequest addPromptParam(OAuth2AuthorizationRequest request) {
        if (request == null) return null;

        Map<String, Object> extraParams = new LinkedHashMap<>(request.getAdditionalParameters());
        extraParams.put("prompt", "select_account");

        return OAuth2AuthorizationRequest.from(request)
                .additionalParameters(extraParams)
                .build();
    }
}
