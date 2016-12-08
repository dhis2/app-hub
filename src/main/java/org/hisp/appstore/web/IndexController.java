package org.hisp.appstore.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by zubair on 05.12.16.
 */

@Controller
public class IndexController
{
    @RequestMapping( value = "/login" , method = RequestMethod.GET)
    public String loginIndexPage( Model model )
    {
        return "login";
    }

    @RequestMapping( value = "/logout" , method = RequestMethod.GET)
    public String logoutPage( Model model )
    {
        return "login";
    }
}
