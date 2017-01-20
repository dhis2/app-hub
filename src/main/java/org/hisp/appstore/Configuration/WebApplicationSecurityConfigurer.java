package org.hisp.appstore.Configuration;

import com.auth0.spring.security.mvc.Auth0Config;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Created by zubair on 19.01.17.
 */
@Configuration
@EnableWebSecurity
public class WebApplicationSecurityConfigurer extends Auth0Config
{
    @Override
    protected void authorizeRequests(final HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/css/**", "/fonts/**", "/js/**", "/login").permitAll()
                .antMatchers("/apps").permitAll()
                .antMatchers("/manager*").hasAuthority("ROLE_ADMIN")
                .antMatchers("/user").hasAuthority("ROLE_USER")
                .antMatchers("/apps/all").hasAuthority("ROLE_MANAGER")
                .antMatchers( securedRoute ).authenticated()
                .and()
                .formLogin().loginPage("/login")
                .and()
                .logout().logoutUrl("/logout").logoutSuccessUrl("/login");
    }

}
