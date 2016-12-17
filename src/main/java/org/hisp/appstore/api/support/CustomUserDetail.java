package org.hisp.appstore.api.support;

import org.hisp.appstore.api.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * Created by zubair on 12.12.16.
 */
public class CustomUserDetail
        extends User implements UserDetails
{
    public CustomUserDetail( User user )
    {
        super( user );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        return getUserDetails();
    }

    @Override
    public boolean isAccountNonExpired()
    {
        return true;
    }

    @Override
    public boolean isAccountNonLocked()
    {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired()
    {
        return true;
    }

    @Override
    public boolean isEnabled()
    {
        return true;
    }
}
