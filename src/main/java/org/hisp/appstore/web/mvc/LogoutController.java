package org.hisp.appstore.web.mvc;

import org.hisp.appstore.configuration.WebApplicationSecurityConfigurer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zubair on 20.01.17.
 */
public class LogoutController
{
    @Autowired
    private WebApplicationSecurityConfigurer securityConfigurer;

    @RequestMapping( value="/logout", method = RequestMethod.GET )
    protected String logout( HttpServletRequest request )
    {
        invalidateSession( request );

        return "redirect:" + securityConfigurer.getOnLogoutRedirectTo();
    }

    private void invalidateSession( HttpServletRequest request )
    {
        if ( request.getSession() != null )
        {
            request.getSession().invalidate();
        }
    }
}
