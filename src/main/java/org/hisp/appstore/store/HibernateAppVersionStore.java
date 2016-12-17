package org.hisp.appstore.store;

import org.hisp.appstore.api.AppVersionStore;
import org.hisp.appstore.api.domain.AppVersion;
import org.hisp.appstore.util.HibernateGenericDao;

/**
 * Created by zubair on 17.12.16.
 */
public class HibernateAppVersionStore
        extends HibernateGenericDao<AppVersion>
        implements AppVersionStore
{
    @Override
    public Class<AppVersion> getClazz()
    {
        return AppVersion.class;
    }
}
