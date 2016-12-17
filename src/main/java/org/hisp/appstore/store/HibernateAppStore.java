package org.hisp.appstore.store;

import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.hisp.appstore.api.AppQueryParameters;
import org.hisp.appstore.api.ReviewStore;
import org.hisp.appstore.api.UserStore;
import org.hisp.appstore.api.domain.*;
import org.hisp.appstore.api.AppStore;
import org.hisp.appstore.util.HibernateGenericDao;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Transactional
public class HibernateAppStore
        extends HibernateGenericDao<App> implements  AppStore
{
    private ReviewStore reviewStore;

    public void setReviewStore( ReviewStore reviewStore )
    {
        this.reviewStore = reviewStore;
    }

    private UserStore userStore;

    public void setUserStore( UserStore userStore )
    {
        this.userStore = userStore;
    }

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

    @Override
    public App injectObjects( App app )
    {
        User user = userStore.getCurrentUser();

        Set<AppVersion> versions = app.getVersions();

        versions.forEach( v -> v.setAutoFields() );

        app.setOwner( user );
        app.setVersions( versions );

        return app;
    }

    private Query getHqlQuery ( AppQueryParameters queryParameters )
    {
        return null;
    }
}
