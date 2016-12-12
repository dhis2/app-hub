package org.hisp.appstore.store;

import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.AppStore;
import org.hisp.appstore.util.HibernateGenericDao;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public class HibernateAppStore
        extends HibernateGenericDao<App> implements  AppStore
{
    @Override
    public Class<App> getClazz()
    {
        return App.class;
    }
}
