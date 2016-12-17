package org.hisp.appstore.store;

import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.hisp.appstore.api.AppQueryParameters;
import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.AppStore;
import org.hisp.appstore.api.domain.AppStatus;
import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.util.HibernateGenericDao;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public class HibernateAppStore
        extends HibernateGenericDao<App> implements  AppStore
{
    @Override
    public Class<App> getClazz()
    {
        return App.class;
    }

    @Override
    public List<App> get( AppQueryParameters queryParameters )
    {
        Query query = getHqlQuery( queryParameters );

        return query.list();
    }

    private Query getHqlQuery ( AppQueryParameters queryParameters )
    {
        return null;
    }
}
