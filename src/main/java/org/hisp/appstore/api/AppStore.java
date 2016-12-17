package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.domain.AppStatus;
import org.hisp.appstore.api.domain.AppType;

import java.util.List;

/**
 * Created by zubair on 01.12.16.
 */
public interface AppStore
    extends GenericDao<App>
{
    List<App> get( AppQueryParameters queryParameters );
}
