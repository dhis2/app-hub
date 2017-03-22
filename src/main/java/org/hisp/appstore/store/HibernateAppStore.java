package org.hisp.appstore.store;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.hisp.appstore.api.*;
import org.hisp.appstore.api.domain.*;
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

    private CurrentUserService currentUserService;

    public void setCurrentUserService( CurrentUserService currentUserService )
    {
        this.currentUserService = currentUserService;
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
        Set<AppVersion> versions = app.getVersions();
        Set<ImageResource> images = app.getImages();

        versions.forEach( v -> v.setAutoFields() );
        images.forEach( i -> i.setAutoFields() );

        app.setOwner( currentUserService.getCurrentUserId() );
        app.setVersions( versions );
        app.setImages( images );

        return app;
    }

    @Override
    public List<App> getAllAppsByOwner( String owner )
    {
        return  getCriteria().add( Restrictions.eq( "owner", owner )).list();
    }

    private Query getHqlQuery (AppQueryParameters queryParameters )
    {
        String hql = "SELECT DISTINCT ap FROM " + APP_TABLE + " ap ";

        boolean where = false;

        if ( queryParameters.hasType() )
        {
            hql += where ? " AND ap.appType = :type" : " WHERE ap.appType = :type";

            where = true;
        }

        hql += where ? " AND ap.status = :status" : " WHERE ap.status = :status";

        Query query = sessionFactory.getCurrentSession().createQuery( hql );

        if ( queryParameters.hasType() )
        {
            query.setParameter( "type", queryParameters.getType() );
        }

        query.setParameter( "status", AppStatus.APPROVED );

        return query;
    }
}
