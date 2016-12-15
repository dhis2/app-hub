package org.hisp.appstore.web.mvc;

import org.hibernate.SessionFactory;
import org.hisp.appstore.api.UserService;
import org.hisp.appstore.api.domain.AppStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by zubair on 10.12.16.
 */
@Controller
public class LoginController
{
    @Autowired
    private UserService userService;

    @Autowired
    private SessionFactory sessionFactory;

    @RequestMapping( value = "/login", method = RequestMethod.GET )
    public String loginPage( @RequestParam( name = "failed", required = false ) boolean failed, Model model )
    {
        if ( failed )
        {
            model.addAttribute( "failedMessage", "Authentication failure" );
        }

        return "login";
    }

    @RequestMapping( value = "/logout", method = RequestMethod.GET )
    public String logoutPage( Model model )
    {
        return "login";
    }
}
