package org.hisp.appstore.web.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.Files;
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
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping ( value = "/api/apps" )
public class AppController
{
    private static final Log log = LogFactory.getLog( AppController.class );

    private static final String NOT_FOUND = "No App found with id: ";

    private static final String ACCESS_DENIED = "Access denied for App with id ";

    private static final String FILE_EXTENTION = "zip";

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    @Autowired
    private AppStoreService appStoreService;

    @Autowired
    private AppVersionService appVersionService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private RenderService renderService;

    @Autowired
    private UserService userService;

    // -------------------------------------------------------------------------
    // GET
    // -------------------------------------------------------------------------

    @RequestMapping( method = RequestMethod.GET )
    public void getApprovedApps( @RequestParam( value = "type", required = false ) AppType type,
                                 @RequestParam( value = "reqdhis", required = false, defaultValue = "" ) String reqDhisVersion,
                                 HttpServletRequest request, HttpServletResponse response ) throws IOException
    {
        AppQueryParameters queryParameters = appStoreService.getParameterFromUrl( type, reqDhisVersion );

        List<App> apps = appStoreService.get( queryParameters );

        renderService.toJson( response.getOutputStream(), apps );
    }

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping( value = "/myapps", method = RequestMethod.GET )
    public void getAllAppsByUser( HttpServletRequest request, HttpServletResponse response ) throws IOException
    {
        User owner = userService.getCurrentUser();

        List<App> apps = appStoreService.getAllAppsByOwner( owner );

        renderService.toJson( response.getOutputStream(), apps );
    }

    @PreAuthorize( "hasRole('ROLE_MANAGER')" )
    @RequestMapping( value = "/all", method = RequestMethod.GET )
    public void getAllApps( HttpServletRequest request, HttpServletResponse response ) throws IOException
    {
        List<App> apps = appStoreService.getAllApps();

        renderService.toJson( response.getOutputStream(), apps );
    }

    @RequestMapping( value = "/{uid}", method = RequestMethod.GET )
    public void getApp( @PathVariable( value = "uid" ) String appUid,
                        HttpServletRequest request, HttpServletResponse response ) throws IOException, WebMessageException
    {
        Set<String> userAuths = userService.getCurrentUser().getAuths();

        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        decideAccess( app );

        renderService.toJson( response.getOutputStream(), app );
    }

    @PreAuthorize( "isAuthenticated()" )
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

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/versions", method = RequestMethod.GET )
    public void listVersions(  @PathVariable( "uid" ) String appUid,
                              HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        Set<AppVersion> versions = app.getVersions();

        renderService.toJson( response.getOutputStream(), versions );
    }

    // -------------------------------------------------------------------------
    // POST
    // -------------------------------------------------------------------------

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping( method = RequestMethod.POST )
    public void uploadApp( @RequestPart( name = "file" ) MultipartFile file,
                           @RequestPart( name = "app" ) App app,
                           HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException
    {
        if ( !FILE_EXTENTION.equals( Files.getFileExtension( file.getOriginalFilename() ) ) )
        {
            throw new WebMessageException( WebMessageUtils.denied( "File extention must be zip" ) );
        }

        appStoreService.uploadApp( app, file );

        renderService.toJson( response.getOutputStream(), "App Uploaded");
    }

    @PreAuthorize( "isAuthenticated()" )
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

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/versions", method = RequestMethod.POST )
    public void addVersionToApp( @RequestPart( name = "file" ) MultipartFile file,
                                 @RequestPart( name = "version" ) AppVersion version,
                                 @PathVariable( name = "uid" ) String appUid,
                                 HttpServletResponse response, HttpServletRequest request )
                                throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        decideAccess( app );

        AppVersion addedVersion = appStoreService.addVersionToApp( app, version, file );

        renderService.toJson( response.getOutputStream(), addedVersion );
    }

    @PreAuthorize( "hasRole('ROLE_MANAGER')" )
    @RequestMapping ( value = "/{uid}/approval", method = RequestMethod.POST )
    public void approveApp( @PathVariable( "uid" ) String appUid,
                            @RequestParam( name = "status" ) AppStatus status,
                            HttpServletResponse response, HttpServletRequest request )
                          throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        appStoreService.setAppApproval( app, status );

        renderService.renderOk( response, request, "Status changed for app: " + app.getName() );
    }
    // -------------------------------------------------------------------------
    // PUT
    // -------------------------------------------------------------------------

    @PreAuthorize( "hasRole('ROLE_USER')" )
    @RequestMapping ( value = "/{uid}", method = RequestMethod.PUT )
    public void updateApp( @PathVariable( "uid" ) String appUid,
                           HttpServletResponse response, HttpServletRequest request )
                          throws IOException, WebMessageException
    {
        App persistedApp = appStoreService.getApp( appUid );

        if ( persistedApp == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }
        
        decideAccess( persistedApp );

        App updatedApp = renderService.fromJson( request.getInputStream(), App.class );

        persistedApp.mergeWith( updatedApp );

        appStoreService.updateApp( persistedApp );

        renderService.renderOk( response, request, "App updated" );
    }

    @PreAuthorize( "isAuthenticated()" )
@RequestMapping ( value = "/{uid}/versions/{vuid}", method = RequestMethod.PUT )
    public void updateVersion(  @PathVariable( "uid" ) String appUid,
                                @PathVariable( "vuid" ) String vuid,
                               HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        AppVersion persistedVersion = appVersionService.get( vuid );

        if ( app == null || persistedVersion == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( "Either app or version does not exist" ) );
        }

        decideAccess( app );

        AppVersion updatedVersion = renderService.fromJson( request.getInputStream(), AppVersion.class );

        persistedVersion.mergeWith( updatedVersion );

        appVersionService.update( persistedVersion );

        renderService.renderOk( response, request, "Version with id " + vuid + " updated" );
    }

    // -------------------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------------------

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}", method = RequestMethod.DELETE )
    public void deleteApp( @PathVariable( "uid" ) String appUid,
                           HttpServletResponse response, HttpServletRequest request )
                          throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        decideAccess( app );

        appStoreService.removeApp( app );

        renderService.renderOk( response, request, "App Removed" );
    }

    @PreAuthorize( "isAuthenticated()" )
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

        decideAccess( app );

        appStoreService.removeReviewFromApp( app, review );

        renderService.renderOk( response, request, "Review Removed" );
    }

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/version/{vuid}", method = RequestMethod.DELETE )
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

        decideAccess( app );

        appStoreService.removeVersionFromApp( app, version );

        renderService.renderOk( response, request, "Version Removed" );
    }

    private void decideAccess( App app ) throws WebMessageException
    {
        User currentUser = userService.getCurrentUser();

        if ( !currentUser.equals( app.getOwner() ) && !currentUser.isManager() )
        {
            throw new WebMessageException( WebMessageUtils.denied( "Access denied" ) );
        }
    }
}
