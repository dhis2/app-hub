package org.hisp.appstore.util;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by zubair on 23.01.17.
 */
public class CustomAccessDeniedHandler implements AccessDeniedHandler
{
    @Override
    public void handle( HttpServletRequest request, HttpServletResponse response,
        AccessDeniedException ex ) throws IOException, ServletException
    {
        response.sendRedirect( "/api/403" );
    }
}
