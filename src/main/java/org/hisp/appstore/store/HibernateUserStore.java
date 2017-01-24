package org.hisp.appstore.store;

import com.auth0.Auth0User;
import com.auth0.SessionUtils;
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
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

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
    public User getUserByEmail( String email )
    {
        return (User) getCriteria().add(Restrictions.eq( "email",email )).uniqueResult();
    }

    @Override
    public User getCurrentUser()
    {
        HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();

        Auth0User currentAuth0User = (Auth0User) SessionUtils.getAuth0User( request );

        return getUserByEmail( currentAuth0User.getEmail() );
    }
}
