package org.hisp.appstore.web.mvc;

import com.auth0.Auth0User;
import com.auth0.SessionUtils;
import com.auth0.spring.security.mvc.Auth0CallbackHandler;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.UserService;
import org.hisp.appstore.api.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
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
    private static final Log log = LogFactory.getLog( CallbackController.class );

    @Autowired
    private UserService userService;

    @RequestMapping( value = "/callback", method = RequestMethod.GET )
    protected void callback(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException
    {
        super.handle( request, response );
        Auth0User currentAuth0User = SessionUtils.getAuth0User( request );

        handleCurrentAuth0User( currentAuth0User );
    }

    private void handleCurrentAuth0User( Auth0User currentAuth0User )
    {
        User currentUser = userService.getUserByEmail( currentAuth0User.getEmail() );

        if ( currentUser != null )
        {
            return;
        }

        currentUser = new User();
        currentUser.mergeWith( currentAuth0User );

        userService.addUser( currentUser );

        log.info( "New user registered" );
    }
}
