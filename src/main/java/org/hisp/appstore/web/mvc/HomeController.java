package org.hisp.appstore.web.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by zubair on 05.12.16.
 */

@Controller
public class HomeController
{
    @RequestMapping( value = "/*", method = RequestMethod.GET )
    public String loginPage( Model model )
    {
        return "home";
    }

    @RequestMapping( value = "/user", method = RequestMethod.GET )
    public String userPage( Model model )
    {
        return "user";
    }
}
