package org.hisp.appstore.store;

import org.hisp.appstore.api.AppStore;
import org.hisp.appstore.api.ReviewStore;
import org.hisp.appstore.api.UserStore;
import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.domain.Review;
import org.hisp.appstore.api.domain.User;
import org.hisp.appstore.util.HibernateGenericDao;

/**
 * Created by zubair on 16.12.16.
 */
public class HibernateReviewStore
        extends HibernateGenericDao<Review> implements ReviewStore
{
    private UserStore userStore;

    public void setUserStore( UserStore userStore )
    {
        this.userStore = userStore;
    }

    @Override
    public Class<Review> getClazz()
    {
        return Review.class;
    }

    @Override
    public Review preCreate( Review object )
    {
        User user = userStore.getCurrentUser();

        object.setAutoFields();
        object.setUser( user );

        return object;
    }
}
