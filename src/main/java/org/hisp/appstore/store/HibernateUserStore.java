package org.hisp.appstore.store;

import org.hisp.appstore.api.domain.User;
import org.hisp.appstore.api.UserStore;
import org.hisp.appstore.util.HibernateGenericDao;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by zubair on 06.12.16.
 */
@Transactional
public class HibernateUserStore
        extends HibernateGenericDao<User> implements UserStore
{
    @Override
    public Class<User> getClazz()
    {
        return User.class;
    }

    @Override
    public User getUserByUsername(String userName)
    {
        return null;
    }
}
