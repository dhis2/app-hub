package org.hisp.appstore.store;

import org.hibernate.criterion.Restrictions;
import org.hisp.appstore.api.domain.User;
import org.hisp.appstore.api.UserStore;
import org.hisp.appstore.util.HibernateGenericDao;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by zubair on 06.12.16.
 */
@Transactional
public class HibernateUserStore
        extends HibernateGenericDao<User> implements UserStore
{
    private UserStore userStore;

    public void setUserStore( UserStore userStore )
    {
        this.userStore = userStore;
    }

    @Override
    public Class<User> getClazz()
    {
        return User.class;
    }

    @Override
    public User getUserByUsername( String userName )
    {
        return (User) getCriteria().add(Restrictions.eq( "username",userName )).uniqueResult();
    }

    @Override
    public User getCurrentUser()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if ( authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null )
        {
            return null;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return getUserByUsername( userDetails.getUsername() );
    }
}
