package org.hisp.appstore.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
    private static final Log log = LogFactory.getLog( CustomAccessDeniedHandler.class );

    private String errorPage;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException e) throws IOException, ServletException
    {
        // check if this is an API call then return json error else return error in html

        if ( request.getRequestURL().toString().contains("/all") )
        {
            response.sendRedirect("/api/403");
            return;
        }

        response.sendRedirect("/403");
    }

    public String getErrorPage()
    {
        return errorPage;
    }

    public void setErrorPage( String errorPage )
    {
        this.errorPage = errorPage;
    }
}
