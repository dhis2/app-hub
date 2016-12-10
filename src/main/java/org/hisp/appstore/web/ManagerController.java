package org.hisp.appstore.web;

import org.hisp.appstore.api.User;
import org.hisp.appstore.session.CurrentUser;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by zubair on 09.12.16.
 */
@Controller
@RequestMapping ( value = "/manager" )
public class ManagerController
{
    @RequestMapping( method = RequestMethod.GET )
    public String loginIndexPage( Model model, @CurrentUser User currentUser )
    {
        System.out.println(" Rendered manager page ");

        model.addAttribute( "username", currentUser.getUsername() );

        return "manager";
    }
}
