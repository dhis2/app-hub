package org.hisp.appstore.store;

import org.hisp.appstore.api.CurrentUserService;
import org.hisp.appstore.api.ReviewStore;
import org.hisp.appstore.api.domain.Review;
import org.hisp.appstore.util.HibernateGenericDao;

/**
 * Created by zubair on 16.12.16.
 */
public class HibernateReviewStore
        extends HibernateGenericDao<Review> implements ReviewStore
{
    private CurrentUserService currentUserService;

    public void setCurrentUserService( CurrentUserService currentUserService )
    {
        this.currentUserService = currentUserService;
    }

    @Override
    public Class<Review> getClazz()
    {
        return Review.class;
    }

    @Override
    public Review preCreate( Review object )
    {
        object.setAutoFields();
        object.setUserId( currentUserService.getCurrentUserId() );

        return object;
    }
}
