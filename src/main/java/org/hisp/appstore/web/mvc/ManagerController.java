package org.hisp.appstore.web.mvc;

import org.hisp.appstore.api.UserService;
import org.hisp.appstore.api.domain.User;
import org.hisp.appstore.session.CurrentUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;


/**
 * Created by zubair on 09.12.16.
 */
@Controller
@RequestMapping ( value = "/manager" )
public class ManagerController
{
    @Autowired
    private UserService userService;

    @RequestMapping( method = RequestMethod.GET )
    public String managerIndex( Model model )
    {

        User currentUser = userService.getCurrentUser();

        model.addAttribute( "message", currentUser.getFirstName() );

        return "manager";
    }
}
