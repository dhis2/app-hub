/*package org.hisp.appstore.configuration;

import com.auth0.spring.security.mvc.Auth0CORSFilter;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AppStoreCORSFilter extends Auth0CORSFilter
{
    @Override
    public void doFilter( final ServletRequest req, final ServletResponse res, final FilterChain chain ) throws IOException, ServletException
    {
        final HttpServletResponse response = (HttpServletResponse) res;

        response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE" );
        response.setHeader("Access-Control-Max-Age", "3600" );

        response.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, " +
                "Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers" );

        // Set CORS headers for dev server
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:9000" );
        response.setHeader("Access-Control-Allow-Credentials", "true" );

        chain.doFilter( req, response );
    }
} */