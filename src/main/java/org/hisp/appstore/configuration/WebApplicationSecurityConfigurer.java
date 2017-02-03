package org.hisp.appstore.configuration;

import com.auth0.spring.security.mvc.Auth0Config;
import org.hisp.appstore.util.CustomAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Created by zubair on 19.01.17.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity( prePostEnabled = true )
public class WebApplicationSecurityConfigurer extends Auth0Config
{
    @Bean
    public CustomAccessDeniedHandler getAccessDeniedHandler()
    {
        CustomAccessDeniedHandler customAccessDeniedHandler = new CustomAccessDeniedHandler();

        return customAccessDeniedHandler;
    }

    @Override
    protected void authorizeRequests(final HttpSecurity http) throws Exception {

        http.authorizeRequests()
                .antMatchers("/css/**", "/fonts/**", "/js/**", "/login").permitAll()
                .antMatchers( securedRoute ).authenticated()
                .and()
                .formLogin().loginPage("/login")
                .and()
                .exceptionHandling().accessDeniedHandler( getAccessDeniedHandler() );
    }
}
