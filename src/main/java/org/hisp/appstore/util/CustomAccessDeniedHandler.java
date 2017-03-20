package org.hisp.appstore.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private static final Log log = LogFactory.getLog( CustomAccessDeniedHandler.class );

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException e) throws IOException, ServletException
    {
        response.sendRedirect("/api/403");
    }
}
