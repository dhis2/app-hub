package org.hisp.appstore.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.*;
import org.hisp.appstore.api.domain.*;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Transactional
public class DefaultAppService
        implements AppStoreService
{
    private static final Log log = LogFactory.getLog( DefaultAppService.class );

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private UserService userService;

    public void setUserService( UserService userService )
    {
        this.userService = userService;
    }

    private ReviewStore reviewStore;

    public void setReviewStore( ReviewStore reviewStore )
    {
        this.reviewStore = reviewStore;
    }

    private AppStore appStore;

    public void setAppStore ( AppStore appStore )
    {
        this.appStore = appStore;

        log.info("AppStore loaded");
    }

    private FileStorageService fileStorageService;

    public void setFileStorageService ( FileStorageService fileStorageService )
    {
        this.fileStorageService = fileStorageService;
    }

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public App getApp( int id )
    {
        return appStore.get( id );
    }

    @Override
    public App getApp( String uid )
    {
        return appStore.get( uid );
    }

    @Override
    public List<App> get( AppQueryParameters queryParameters )
    {
        return appStore.get( queryParameters );
    }

    @Override
    public List<App> getAllApps( )
    {
        return appStore.getAll();
    }

    @Override
    public List<App> getAllAppsByStatus( AppStatus status )
    {
        return appStore.getAllAppsByStatus( status );
    }

    @Override
    public void updateApp( App app )
    {
        appStore.update( app );
    }

    @Override
    public void deleteApp( App app )
    {
        appStore.delete( app );
    }

    @Override
    public int saveApp( App app )
    {
        return appStore.save( app );
    }

    @Override
    public void setAppApproval ( App app, AppStatus status)
    {
        app.setStatus( status );

        appStore.update( app );

        log.info( "Status changed for " + app.getAppName() );
    }

    @Override
    public void removeReviewFromApp(  App app, Review review )
    {
        app.getReviews().remove( review );

        appStore.update( app );

        log.info("Review removed from App");
    }

    @Override
    public void addReviewToApp(  App app, Review review )
    {
        User user = userService.getCurrentUser();
        review.setAutoFields();
        review.setUser( user );

        app.getReviews().add( review );

        appStore.update( app );

        log.info("Review added to App");
    }

    @Override
    public void uploadApp( App app, MultipartFile file ) throws WebMessageException
    {
        FileUploadStatus status = fileStorageService.uploadFile( file, app.getAppType() );

        saveApp( populateAppData( app, status ) );
    }

    @Override
    public void removeApp( App app )
    {
        app.getVersions().forEach(v -> fileStorageService.deleteFile(app.getAppType(), getKeyFromResourceUrl( v.getDownloadUrl() )));

        appStore.delete( app );

        log.info("App deleted");
    }

    @Override
    public void addVersionToApp( App app, AppVersion version, MultipartFile file ) throws WebMessageException
    {
        FileUploadStatus status = fileStorageService.uploadFile( file, app.getAppType() );

        version.setAutoFields();

        version.setDownloadUrl( status.getDownloadUrl() );

        app.getVersions().add( version );

        appStore.update( app );

        log.info("New version added to App");
    }

    @Override
    public void removeVersionFromApp( App app, AppVersion version ) throws WebMessageException
    {
        fileStorageService.deleteFile( app.getAppType(), getKeyFromResourceUrl( version.getDownloadUrl() ));

        app.getVersions().remove( version );

        appStore.update( app );

        log.info("Version :" + version.getVersion() + " has been removed from App");
    }

    @Override
    public AppQueryParameters getParameterFromUrl( AppType type, String reqDhisVersion )
    {
        AppQueryParameters queryParameters = new AppQueryParameters();

        queryParameters.setReqDhisVersion( reqDhisVersion );
        queryParameters.setType( type );

        return queryParameters;
    }

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    private App populateAppData( App app, FileUploadStatus status )
    {
        app.getVersions().forEach( v -> v.setDownloadUrl( status.getDownloadUrl() ) );

        return app;
    }

    private String getKeyFromResourceUrl( String resourceUrl )
    {
        return StringUtils.substringAfterLast( resourceUrl, "/").trim();
    }
}
