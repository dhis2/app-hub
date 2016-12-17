package org.hisp.appstore.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.domain.User;
import org.hisp.appstore.api.UserService;
import org.hisp.appstore.api.UserStore;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by zubair on 02.12.16.
 */
@Transactional
public class DefaultUserService implements
        UserService, UserDetailsService
{
    private static final Log log = LogFactory.getLog( DefaultUserService.class );

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private PasswordEncoder passwordEncoder;

    public void setPasswordEncoder( PasswordEncoder passwordEncoder )
    {
        this.passwordEncoder = passwordEncoder;
    }

    private UserStore userStore;

    public void setUserStore( UserStore userStore )
    {
        this.userStore = userStore;
    }

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public UserDetails loadUserByUsername( String userName ) throws UsernameNotFoundException
    {

        User user = userStore.getUserByUsername( userName ) ;

        if ( user == null )
        {
            throw new UsernameNotFoundException( "User not found" );
        }

        return user.getUserDetails();
    }

    @Override
    public int addUser( User user )
    {
        user.setPassword( passwordEncoder.encode( user.getPassword() ) );

        return userStore.save( user );
    }

    @Override
    public void deleteUser( User user )
    {
        userStore.delete( user );
    }

    @Override
    public void updateUser( User user )
    {
        userStore.update( user );
    }

    @Override
    public User getUser( int id )
    {
        return userStore.get( id );
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

    @Override
    public List<User> getAll()
    {
        return userStore.getAll();
    }

    @Override
    public User getUserByUsername( String userName )
    {
        return userStore.getUserByUsername( userName );
    }
}
