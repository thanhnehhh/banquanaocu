package com.example.demo.security;

import com.example.demo.filter.JwtAuthFilter;
import com.example.demo.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2FailureHandler;
    private final ClientRegistrationRepository clientRegistrationRepository;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserService userService,
                          PasswordEncoder passwordEncoder,
                          OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler,
                          OAuth2AuthenticationFailureHandler oAuth2FailureHandler,
                          ClientRegistrationRepository clientRegistrationRepository) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.oAuth2FailureHandler = oAuth2FailureHandler;
        this.clientRegistrationRepository = clientRegistrationRepository;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                // ── WebSocket (SockJS) ─────────────────────────────────────────
                .requestMatchers(Endpoints.WEBSOCKET_ENDPOINTS).permitAll()

                // ── Public ────────────────────────────────────────────────────
                .requestMatchers(HttpMethod.GET, Endpoints.PUBLIC_GET_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.POST, Endpoints.PUBLIC_POST_ENDPOINTS).permitAll()

                // ── Seller endpoints (phải đứng trước ADMIN_GET_ENDPOINTS vì /api/products/* sẽ match /api/products/seller) ─
                .requestMatchers(HttpMethod.GET, "/api/products/seller").authenticated()

                // ── Admin only ────────────────────────────────────────────────
                .requestMatchers(HttpMethod.GET, Endpoints.ADMIN_GET_ENDPOINTS).hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, Endpoints.ADMIN_PUT_ENDPOINTS).hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")

                // ── Authenticated ─────────────────────────────────────────────
                .anyRequest().authenticated());

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        http.oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(auth -> auth
                        .baseUri("/api/oauth2/authorization")
                        .authorizationRequestResolver(
                                new CustomAuthorizationRequestResolver(
                                        clientRegistrationRepository,
                                        "/api/oauth2/authorization"
                                )
                        )
                )
                .successHandler(oAuth2SuccessHandler)
                .failureHandler(oAuth2FailureHandler));

        // Trả 401 JSON cho /api/** thay vì redirect sang OAuth2 login
        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of(Endpoints.front_end_host));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-Requested-With", "Accept"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}