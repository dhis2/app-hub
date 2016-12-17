package org.hisp.appstore.store;

import org.hisp.appstore.api.AppStore;
import org.hisp.appstore.api.ReviewStore;
import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.domain.Review;
import org.hisp.appstore.util.HibernateGenericDao;

/**
 * Created by zubair on 16.12.16.
 */
public class HibernateReviewStore
        extends HibernateGenericDao<Review> implements ReviewStore
{
    @Override
    public Class<Review> getClazz()
    {
        return Review.class;
    }

    @Override
    public Review injectObjects( Review object )
    {
        return null;
    }
}
