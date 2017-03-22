package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.domain.AppStatus;

import java.util.List;

/**
 * Created by zubair on 01.12.16.
 */
public interface AppStore
    extends GenericDao<App>
{
    List<App> get( AppQueryParameters queryParameters );

    List<App> getAllAppsByStatus( AppStatus status );

    List<App> getAllAppsByOwner( String owner );
}
