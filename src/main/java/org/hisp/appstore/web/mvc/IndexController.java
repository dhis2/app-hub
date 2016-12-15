package org.hisp.appstore.web.mvc;

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
    @RequestMapping( value = "/*", method = RequestMethod.GET )
    public String loginPage( Model model )
    {
        return "home";
    }
}
