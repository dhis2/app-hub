package org.hisp.appstore.web.mvc;

import com.auth0.Auth0User;
import com.auth0.SessionUtils;
import com.auth0.spring.security.mvc.Auth0CallbackHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;

/**
 * Created by zubair on 20.01.17.
 */
@Controller
public class CallbackController extends Auth0CallbackHandler
{
    @RequestMapping( value = "/callback", method = RequestMethod.GET )
    protected void callback(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException
    {
        super.handle( request, response );
    }
}
