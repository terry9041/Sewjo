package com.sewjo.main.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String clientUrl = System.getProperty("CLIENT_URL", "https://sewjo-client.onrender.com");
        System.out.println("CLIENT_URL: " + clientUrl);
        if (clientUrl != null && !clientUrl.isEmpty()) {
            registry.addMapping("/api/**")
                    .allowedOrigins(clientUrl)
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    }
    
}
