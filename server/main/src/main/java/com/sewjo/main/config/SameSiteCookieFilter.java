package com.sewjo.main.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Filter that adds SameSite=None; Secure to the Set-Cookie header.
 */
@Component
public class SameSiteCookieFilter implements Filter {

    /**
     * Adds SameSite=None; Secure to the Set-Cookie header.
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        chain.doFilter(request, response);
        if (response instanceof HttpServletResponse) {
            HttpServletResponse httpServletResponse = (HttpServletResponse) response;
            String header = httpServletResponse.getHeader("Set-Cookie");
            if (header != null) {
                header = header + "; SameSite=None; Secure";
                httpServletResponse.setHeader("Set-Cookie", header);
            }
        }
    }

    /**
     * Initializes the filter.
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    /**
     * Destroys the filter.
     */
    @Override
    public void destroy() {
    }
}
