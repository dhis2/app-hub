package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.AppVersion;

/**
 * Created by zubair on 17.12.16.
 */
public interface AppVersionService
{
    AppVersion get( int id );

    AppVersion get( String uid );

    void update( AppVersion version );

    void delete( AppVersion version );
}
