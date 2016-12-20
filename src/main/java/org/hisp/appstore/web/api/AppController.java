package org.hisp.appstore.web.api;

import com.sun.org.apache.regexp.internal.RE;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.*;
import org.hisp.appstore.api.domain.*;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping ( value = "/apps" )
public class AppController extends AbstractCrudController<App>
{
    private static final Log log = LogFactory.getLog( AppController.class );

    private static final String NOT_FOUND = "No App found with id: ";

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    @Autowired
    private AppStoreService appStoreService;

    @Autowired
    private UserService userService;

    @Autowired
    private AppVersionService appVersionService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private RenderService renderService;

    // -------------------------------------------------------------------------
    // GET
    // -------------------------------------------------------------------------

    @RequestMapping ( value = "/query", method = RequestMethod.GET, produces = { "application/json" } )
    public void get( @RequestParam( required = false ) AppStatus status,
                                 @RequestParam( required = false ) AppType type,
                                 @RequestParam( required = false, defaultValue = "" ) String reqDhisVersion,
                        HttpServletResponse response, HttpServletRequest request )
                         throws WebMessageException, IOException
    {
        AppQueryParameters queryParameters = appStoreService.getParameterFromUrl( reqDhisVersion, status, type );

        List<App> apps = appStoreService.get( queryParameters );

        renderService.toJson( response.getOutputStream(), apps );
    }

    @RequestMapping ( value = "/{uid}/reviews", method = RequestMethod.GET )
    public void listReviews(  @PathVariable( "uid" ) String appUid,
                              HttpServletResponse response, HttpServletRequest request )
                            throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        Set<Review> reviews = app.getReviews();

        renderService.toJson( response.getOutputStream(), reviews );
    }

    // -------------------------------------------------------------------------
    // POST
    // -------------------------------------------------------------------------

    @RequestMapping ( value = "/{uid}/reviews", method = RequestMethod.POST )
    public void addReviewToApp( @PathVariable( "uid" ) String appUid,
                          HttpServletResponse response, HttpServletRequest request )
                          throws IOException, WebMessageException
    {
        Review review = renderService.fromJson( request.getInputStream(), Review.class );

        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        appStoreService.addReviewToApp( app, review );

        renderService.renderCreated( response, request, "App review added" );
    }

    @RequestMapping ( value = "/{uid}/version", method = RequestMethod.POST )
    public void uploadVersionToApp( @PathVariable( "uid" ) String appUid,
                           HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException
    {
        AppVersion version = renderService.fromJson( request.getInputStream(), AppVersion.class );

        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        appStoreService.addVersionToApp( app, version );

        renderService.renderCreated( response, request, "App version added" );
    }

    @RequestMapping ( value = "/{uid}/approval", method = RequestMethod.POST )
    public void approveApp( @PathVariable( "uid" ) String appUid,
                            @RequestParam( name = "status", required = true ) AppStatus status,
                            HttpServletResponse response, HttpServletRequest request )
                          throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        appStoreService.setAppApproval( app, status );

        renderService.renderOk( response, request, "Status changed for app: " + app.getAppName() );
    }

    @RequestMapping( value = "/upload", method = RequestMethod.POST )
    public void uploadApp(@PathVariable( "file" )MultipartFile file,
                           HttpServletResponse response, HttpServletRequest request )
    {

    }

    // -------------------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------------------

    @RequestMapping ( value = "/{uid}/reviews/{ruid}", method = RequestMethod.DELETE )
    public void deleteReviewFromApp( @PathVariable( "uid" ) String appUid,
                              @PathVariable( "ruid" ) String reviewUid,
                              HttpServletResponse response, HttpServletRequest request )
                             throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        Review review = reviewService.getReview( reviewUid );

        if ( app == null || review == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( "Entities not found with given ids" ) );
        }

        appStoreService.removeReviewFromApp( app, review );

        renderService.renderOk( response, request, "Review Removed" );
    }

    @RequestMapping ( value = "/{uid}/version/{ruid}", method = RequestMethod.DELETE )
    public void removeVersionFromApp( @PathVariable( "uid" ) String appUid,
                              @PathVariable( "vuid" ) String versionUid,
                              HttpServletResponse response, HttpServletRequest request )
                            throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        AppVersion version = appVersionService.get( versionUid );

        if ( app == null || version == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( "Entities not found with given ids" ) );
        }

        appStoreService.removeVersionFromApp( app, version );

        renderService.renderOk( response, request, "Version Removed" );
    }
}
