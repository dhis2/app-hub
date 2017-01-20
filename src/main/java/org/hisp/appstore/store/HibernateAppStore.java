package org.hisp.appstore.store;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.hisp.appstore.api.AppQueryParameters;
import org.hisp.appstore.api.ReviewStore;
import org.hisp.appstore.api.UserStore;
import org.hisp.appstore.api.domain.*;
import org.hisp.appstore.api.AppStore;
import org.hisp.appstore.util.HibernateGenericDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Transactional
public class HibernateAppStore
        extends HibernateGenericDao<App> implements  AppStore
{
    private static final Log log = LogFactory.getLog( HibernateAppStore.class );

    private static final String APP_TABLE = "App";

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
    public List<App> getAllAppsByStatus( AppStatus status )
    {
        return getCriteria().add( Restrictions.eq( "status", status ) ).list();
    }

    @Override
    public App preCreate( App app )
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
        String hql = "SELECT DISTINCT app FROM " + APP_TABLE + " app ";

        boolean where = false;

        if ( queryParameters.hasReqDhisVersion() )
        {
            hql += " WHERE app.requiredDhisVersion = :requireddhisversion ";

            where = true;
        }

        if ( queryParameters.hasType() )
        {
            hql += where ? " AND app.appType = :type" : " WHERE app.appType = :type";

            where = true;
        }

        hql += where ? " AND app.status = :status" : " WHERE app.status = :status";

        Query query = sessionFactory.getCurrentSession().createQuery( hql );

        if ( queryParameters.hasReqDhisVersion() )
        {
            query.setString( "requireddhisversion", queryParameters.getReqDhisVersion() );
        }

        if ( queryParameters.hasType() )
        {
            query.setParameter( "type", queryParameters.getType() );
        }

        query.setParameter( "status", AppStatus.APPROVED );

        return query;
    }
}
