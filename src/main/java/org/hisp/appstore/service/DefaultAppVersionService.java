package org.hisp.appstore.service;

import org.hisp.appstore.api.AppVersionService;
import org.hisp.appstore.api.AppVersionStore;
import org.hisp.appstore.api.domain.AppVersion;

/**
 * Created by zubair on 17.12.16.
 */
public class DefaultAppVersionService
        implements AppVersionService
{
    private AppVersionStore appVersionStore;

    public void setAppVersionStore( AppVersionStore appVersionStore )
    {
        this.appVersionStore = appVersionStore;
    }

    @Override
    public AppVersion get( int id )
    {
        return appVersionStore.get( id );
    }

    @Override
    public AppVersion get( String uid )
    {
        return appVersionStore.get( uid );
    }

    @Override
    public void update( AppVersion version )
    {
        appVersionStore.update( version );
    }

    @Override
    public void delete( AppVersion version )
    {
        appVersionStore.delete( version );
    }
}
