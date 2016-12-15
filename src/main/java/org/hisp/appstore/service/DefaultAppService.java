package org.hisp.appstore.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.AppStore;
import org.hisp.appstore.api.AppStoreService;
import org.hisp.appstore.api.domain.AppStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public class DefaultAppService
        implements AppStoreService
{
    private static final Log log = LogFactory.getLog( DefaultAppService.class );

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

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

        log.info( "AppStatus changed for " + app.getAppName() );
    }
}
