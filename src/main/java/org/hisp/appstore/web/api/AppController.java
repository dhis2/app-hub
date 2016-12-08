package org.hisp.appstore.web.api;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.AppStoreService;
import org.hisp.appstore.api.RenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping ( value = "/api" )
public class AppController
{
    private static final Log log = LogFactory.getLog( AppController.class );

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    @Autowired
    private AppStoreService appStoreService;

    @Autowired
    private RenderService renderService;

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @PreAuthorize( "hasRole('ROLE_DEVELOPER')" )
    @RequestMapping ( value = "/apps", method = RequestMethod.GET, produces = "application/json" )
    public void getApp ( HttpServletResponse response, HttpServletRequest request ) throws IOException
    {
        renderService.toJson( response.getOutputStream(), "Test!!" );
    }

    @RequestMapping ( method = RequestMethod.DELETE, produces = "application/json" )
    public void deleteApp ( HttpServletResponse response, HttpServletRequest request )
    {

    }

    @RequestMapping ( method = RequestMethod.PUT, produces = "application/json" )
    public void updateApp ( HttpServletResponse response, HttpServletRequest request )
    {

    }

    @RequestMapping ( method = RequestMethod.POST, produces = "application/json" )
    public void saveApp ( HttpServletResponse response, HttpServletRequest request )
    {

    }
}
