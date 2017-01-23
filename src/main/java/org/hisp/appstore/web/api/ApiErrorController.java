package org.hisp.appstore.web.api;

import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;

/**
 * Created by zubair on 23.01.17.
 */
@Controller
@RequestMapping( value = "/api" )
public class ApiErrorController
{
    @RequestMapping( value = "/403", method = RequestMethod.GET )
    public String erroPage(HttpServletRequest request, HttpServletResponse response,
                           Model model, Principal principal ) throws WebMessageException
    {
        throw new WebMessageException(WebMessageUtils.forbidden( "You do not have access to this resource" ));
    }
}
