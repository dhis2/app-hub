package org.hisp.appstore.web.api;

import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;

/**
 * Created by zubair on 23.01.17.
 */
@RestController
@RequestMapping( value = "/api" )
public class ApiErrorController
{
    @RequestMapping( value = "/403", method = RequestMethod.GET )
    public String accessDenid(HttpServletRequest request, HttpServletResponse response,
        Model model, Principal principal ) throws WebMessageException
    {
        throw new WebMessageException( WebMessageUtils.forbidden( "You do not have access to this resource" ));
    }

    @RequestMapping( value = "/401", method = RequestMethod.GET )
    public String loginRequired(HttpServletRequest request, HttpServletResponse response,
        Model model, Principal principal ) throws WebMessageException
    {
        throw new WebMessageException( WebMessageUtils.forbidden( "Anonymous user not allowed" ));
    }
}
