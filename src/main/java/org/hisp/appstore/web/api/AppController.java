package org.hisp.appstore.web.api;

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
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping ( value = "/api/apps" )
public class AppController
{
    private static final Log log = LogFactory.getLog( AppController.class );

    private static final String NOT_FOUND = "No App found with id: ";

    private static final String ENTITY_NOT_FOUND = "Entities not found with given ids";

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

    @Autowired
    private ImageResourceService imageResourceService;

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
                           @RequestPart( name = "imageFile", required = false ) MultipartFile imageFile,
                           @RequestPart( name = "app" ) App app,
                           HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException
    {
        if ( file == null )
        {
            throw new WebMessageException( WebMessageUtils.denied( "File must be provided" ) );
        }

        appStoreService.uploadApp( app, file, imageFile );

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

        AppVersion addedVersion = appStoreService.addVersionToApp( app, version, file, ResourceType.ZIP );

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

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/images", method = RequestMethod.POST )
    public void uploadImages( @PathVariable( "uid" ) String appUid,
                              @RequestPart( name = "file" ) MultipartFile file,
                              @RequestPart( name = "image" ) ImageResource imageResource,
                              HttpServletResponse response, HttpServletRequest request )
                             throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        if ( app == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NOT_FOUND + appUid ) );
        }

        if( imageResource.isLogo() && app.hasLogo() )
        {
            throw new WebMessageException( WebMessageUtils.conflict( String.format( "%s already has a logo", app.getName() ) ) );
        }

        decideAccess( app );

        appStoreService.addImagesToApp( app, imageResource, file, ResourceType.IMAGE );

        renderService.renderCreated( response, request, String.format( "Image uploaded for app: %s", app.getName() ) );
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
            throw new WebMessageException( WebMessageUtils.notFound( ENTITY_NOT_FOUND ) );
        }

        decideAccess( app );

        AppVersion updatedVersion = renderService.fromJson( request.getInputStream(), AppVersion.class );

        persistedVersion.mergeWith( updatedVersion );

        appVersionService.update( persistedVersion );

        renderService.renderOk( response, request, "Version with id " + vuid + " updated" );
    }

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/images/{iuid}", method = RequestMethod.PUT )
    public void updateImageResource(  @PathVariable( "uid" ) String appUid,
                                @PathVariable( "iuid" ) String iuid,
                                HttpServletResponse response, HttpServletRequest request )
                                throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        ImageResource persistedImageResource = imageResourceService.get( iuid );

        if ( app == null || persistedImageResource == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( ENTITY_NOT_FOUND ) );
        }

        decideAccess( app );

        ImageResource updatedImageResource = renderService.fromJson( request.getInputStream(), ImageResource.class );

        persistedImageResource.mergeWith( updatedImageResource );

        imageResourceService.update( persistedImageResource );

        renderService.renderOk( response, request, "Image with id " + iuid + " updated" );
    }

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/images/{iuid}/logo", method = RequestMethod.PUT )
    public void updateAppLogo(  @PathVariable( "uid" ) String appUid,
                                @PathVariable( "iuid" ) String iuid,
                                HttpServletResponse response, HttpServletRequest request )
                               throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        ImageResource newLogo = imageResourceService.get( iuid );

        if ( app == null || newLogo == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( ENTITY_NOT_FOUND ) );
        }

        decideAccess( app );

        ImageResource previousLogo = app.getImages().stream().filter( image -> image.isLogo() == true ).findAny().get();

        imageResourceService.setAsLogo( newLogo, previousLogo );

        renderService.renderOk( response, request, String.format( "Image with id %s is set as application logo", iuid ) );
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
            throw new WebMessageException( WebMessageUtils.notFound( ENTITY_NOT_FOUND ) );
        }

        decideAccess( app );

        appStoreService.removeReviewFromApp( app, review );

        renderService.renderOk( response, request, "Review Removed" );
    }

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/versions/{vuid}", method = RequestMethod.DELETE )
    public void removeVersionFromApp( @PathVariable( "uid" ) String appUid,
                                      @PathVariable( "vuid" ) String versionUid,
                                      HttpServletResponse response, HttpServletRequest request )
                                    throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        AppVersion version = appVersionService.get( versionUid );

        if ( app == null || version == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( ENTITY_NOT_FOUND ) );
        }

        decideAccess( app );

        appStoreService.removeVersionFromApp( app, version, ResourceType.ZIP );

        renderService.renderOk( response, request, "Version Removed" );
    }

    @PreAuthorize( "isAuthenticated()" )
    @RequestMapping ( value = "/{uid}/images/{iuid}", method = RequestMethod.DELETE )
    public void removeImageFromApp( @PathVariable( "uid" ) String appUid,
                                    @PathVariable( "iuid" ) String iuid,
                                    HttpServletResponse response, HttpServletRequest request )
                                    throws IOException, WebMessageException
    {
        App app = appStoreService.getApp( appUid );

        ImageResource imageResource = imageResourceService.get( iuid );

        if ( app == null || imageResource == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( ENTITY_NOT_FOUND ) );
        }

        decideAccess( app );

        appStoreService.removeImageFromApp( app, imageResource, ResourceType.IMAGE );

        renderService.renderOk( response, request, String.format( "Image with id %s has been removed", iuid ) );
    }

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    private void decideAccess( App app ) throws WebMessageException
    {
        User currentUser = userService.getCurrentUser();

        if ( !currentUser.equals( app.getOwner() ) && !currentUser.isManager() )
        {
            throw new WebMessageException( WebMessageUtils.denied( "Access denied" ) );
        }
    }
}
