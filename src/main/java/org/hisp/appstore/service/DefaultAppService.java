package org.hisp.appstore.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.*;
import org.hisp.appstore.api.domain.*;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Transactional
public class DefaultAppService
        implements AppStoreService
{
    private static final Log log = LogFactory.getLog( DefaultAppService.class );

    private static final String REMOVED = " %s has been removed from %s ";

    private static final String ADDED = " %s has been added to %s ";

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private ReviewStore reviewStore;

    public void setReviewStore( ReviewStore reviewStore )
    {
        this.reviewStore = reviewStore;
    }

    private CurrentUserService currentUserService;

    public void setCurrentUserService( CurrentUserService currentUserService )
    {
        this.currentUserService = currentUserService;
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
    public List<App> getAllAppsByOwner( String owner )
    {
        return appStore.getAllAppsByOwner( owner );
    }

    @Override
    public void updateApp( App app )
    {
        appStore.update( app );
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

        log.info( String.format( "Status changed for %s", app.getName() ) );
    }

    @Override
    public void removeReviewFromApp(  App app, Review review )
    {
        app.getReviews().remove( review );

        appStore.update( app );

        log.info( String.format( REMOVED, "Review " + review.getUid(), app.getName() ) );
    }

    @Override
    public void addReviewToApp(  App app, Review review )
    {
        String userId = currentUserService.getCurrentUserId();

        review.setAutoFields();
        review.setUserId( currentUserService.getCurrentUserId() );

        app.getReviews().add( review );

        appStore.update( app );

        log.info( String.format( ADDED, "Review " + review.getUid(), app.getName() ) );
    }

    @Override
    public void uploadApp( App app, MultipartFile file, MultipartFile imageFile )
                          throws WebMessageException, IOException
    {
        FileUploadStatus fileStatus = fileStorageService.uploadFile( file, app.getAppType(), ResourceType.ZIP );

        FileUploadStatus imageFileStatus = fileStorageService.uploadFile( imageFile, app.getAppType(), ResourceType.IMAGE );

        if ( fileStatus.isUploaded() )
        {
            app.getVersions().forEach( v -> v.setDownloadUrl( fileStatus.getDownloadUrl() ) );
        }

        if ( imageFileStatus.isUploaded() )
        {
            for ( ImageResource imageResource : app.getImages() )
            {
                imageResource.setImageUrl( imageFileStatus.getDownloadUrl() );
                imageResource.setLogo( true );
            }
        }

        saveApp( app );

        log.info( "App uploaded!" );
    }

    @Override
    public void removeApp( App app )
    {
        app.getVersions().forEach( version -> fileStorageService.deleteFile( app.getAppType(),
                getKeyFromResourceUrl( version.getDownloadUrl() ), ResourceType.ZIP ));

        app.getImages().forEach( image -> fileStorageService.deleteFile( app.getAppType(),
                getKeyFromResourceUrl( image.getImageUrl() ), ResourceType.IMAGE ));

        appStore.delete( app );

        log.info( String.format( "App with name %s deleted", app.getName() ));
    }

    @Override
    public AppVersion addVersionToApp( App app, AppVersion version, MultipartFile file, ResourceType resourceType )
                                    throws WebMessageException, IOException
    {
        FileUploadStatus status = fileStorageService.uploadFile( file, app.getAppType(), resourceType );

        version.setAutoFields();
        version.setDownloadUrl( status.getDownloadUrl() );

        app.getVersions().add( version );

        appStore.update( app );

        log.info( String.format( ADDED, "Version " + version.getVersion(), app.getName() ) );

        return version;
    }

    @Override
    public ImageResource addImagesToApp( App app, ImageResource imageResource, MultipartFile file, ResourceType resourceType )
                                throws WebMessageException, IOException
    {
        FileUploadStatus status = fileStorageService.uploadFile( file, app.getAppType(), resourceType );

        imageResource.setAutoFields();
        imageResource.setImageUrl( status.getDownloadUrl() );

        if ( app.getImages().isEmpty() )
        {
            imageResource.setLogo( true );
        }
        else if ( imageResource.isLogo() )
        {
            app.getImages().stream().forEach( item -> item.setLogo( false ) );
        }

        app.getImages().add( imageResource );

        appStore.update( app );

        log.info( String.format( ADDED, "Image " + imageResource.getUid(), app.getName() ) );

        return imageResource;
    }

    @Override
    public void removeVersionFromApp( App app, AppVersion version, ResourceType resourceType ) throws WebMessageException
    {
        fileStorageService.deleteFile( app.getAppType(), getKeyFromResourceUrl( version.getDownloadUrl() ), resourceType );

        app.getVersions().remove( version );

        appStore.update( app );

        log.info( String.format( REMOVED, "Version " +version.getVersion(), app.getName() ));
    }

    @Override
    public void removeImageFromApp( App app, ImageResource imageResource, ResourceType resourceType )
    {
        fileStorageService.deleteFile( app.getAppType(), getKeyFromResourceUrl( imageResource.getImageUrl() ), resourceType );

        app.getImages().remove( imageResource );

        appStore.update( app );

        log.info( String.format( REMOVED, "Image " + imageResource.getUid(), app.getName() ) );
    }

    @Override
    public AppQueryParameters getParameterFromUrl( AppType type, String reqDhisVersion )
    {
        AppQueryParameters queryParameters = new AppQueryParameters();

        queryParameters.setReqDhisVersion( reqDhisVersion );
        queryParameters.setType( type );

        return queryParameters;
    }

    @Override
    public void setAppLogo( App app, ImageResource imageResource )
    {
        if ( imageResource.isLogo() )
        {
            app.getImages().forEach( item -> item.setLogo( false ) );

            app.getImages().add( imageResource );

            updateApp( app );
        }
    }

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    private String getKeyFromResourceUrl( String resourceUrl )
    {
        return StringUtils.substringAfterLast( resourceUrl, "/").trim();
    }
}
