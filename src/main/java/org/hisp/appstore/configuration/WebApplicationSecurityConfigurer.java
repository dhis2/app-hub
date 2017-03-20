package org.hisp.appstore.configuration;

import com.auth0.spring.security.api.Auth0SecurityConfig;
import org.hisp.appstore.service.DefaultCurrentUserService;
import org.hisp.appstore.util.CustomAccessDeniedHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by zubair on 19.01.17.
 */
@Configuration
@EnableWebSecurity( debug = true )
@EnableGlobalMethodSecurity( prePostEnabled = true )
@Order( SecurityProperties.ACCESS_OVERRIDE_ORDER )
public class WebApplicationSecurityConfigurer extends Auth0SecurityConfig
{
    @Bean
    public Auth0Client auth0Client()
    {
        return new Auth0Client( clientId, issuer );
    }

    @Bean
    public CustomAccessDeniedHandler getAccessDeniedHandler()
    {
        CustomAccessDeniedHandler customAccessDeniedHandler = new CustomAccessDeniedHandler();

        return customAccessDeniedHandler;
    }

    @Bean
    public AuthenticationEntryPoint getAuthenticationEntryPoint()
    {
        AuthenticationEntryPoint authenticationEntryPoint = new AuthenticationEntryPoint()
        {
            @Override
            public void commence( HttpServletRequest request, HttpServletResponse response,
                                  AuthenticationException e ) throws IOException, ServletException
            {
                response.sendRedirect("/api/401");
            }
        };

        return authenticationEntryPoint;
    }

    @Override
    protected void authorizeRequests( final HttpSecurity http ) throws Exception
    {
/*        http.authorizeRequests()
                .antMatchers( "/css*//**", "/fonts*//**", "/js*//**", "/login", "/home" ).permitAll()
                .antMatchers( securedRoute ).authenticated()
                .and()
                .formLogin().loginPage( "/login" )
                .and()
                .exceptionHandling().authenticationEntryPoint( getAuthenticationEntryPoint() )
                .accessDeniedHandler( getAccessDeniedHandler());*/


        http.authorizeRequests()
                .antMatchers( "/api/apps/ping", "/api/apps/pong", "/api/apps" ).permitAll()
                .anyRequest().authenticated();
    }

    String getAuthorityStrategy() {
        return super.authorityStrategy;
    }
}
