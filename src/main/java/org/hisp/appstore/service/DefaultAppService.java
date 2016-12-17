package org.hisp.appstore.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.*;
import org.hisp.appstore.api.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    public void upLoadApp( MultipartFile file )
    {

    }

    @Override
    public AppQueryParameters getParameterFromUrl( String requiredDhisVersion, AppStatus status, AppType type )
    {
        AppQueryParameters queryParameters = new AppQueryParameters();

        queryParameters.setReqDhisVersion( requiredDhisVersion );
        queryParameters.setStatus( status );
        queryParameters.setType( type );

        return queryParameters;
    }
}
