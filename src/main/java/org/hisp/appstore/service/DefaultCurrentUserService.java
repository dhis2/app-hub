package org.hisp.appstore.service;

import com.auth0.authentication.result.UserProfile;
import com.auth0.spring.security.api.Auth0JWTToken;
import com.auth0.spring.security.api.Auth0UserDetails;
import org.hisp.appstore.api.CurrentUserService;
import org.hisp.appstore.configuration.Auth0Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;


/**
 * Created by zubair on 20.03.17.
 */
@Transactional
public class DefaultCurrentUserService
        implements CurrentUserService
{
    private static final String ROLE_MANAGER = "ROLE_MANAGER";
    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    @Autowired
    private Auth0Client auth0Client;

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public String getCurrentUserId()
    {
        return getCurrentUserProfile().getId();
    }

    @Override
    public boolean isManager()
    {
        return getCurrentUserAuthorities().contains( ROLE_MANAGER );
    }

    @Override
    public Set<String> getUserAuthorities()
    {
        return getCurrentUserAuthorities();
    }

    @Override
    public String getCurrentUserEmail()
    {
        return getCurrentUserProfile().getEmail();
    }

    @Override
    public String getCurrentUserGivenName()
    {
        return getCurrentUserProfile().getGivenName();
    }

    @Override
    public String getCurrentUserFamilyName()
    {
        return getCurrentUserProfile().getFamilyName();
    }

    private Set<String> getCurrentUserAuthorities()
    {
        Set<String> authorities = getAuth0UserDetails().getAuthorities()
                .stream().map( GrantedAuthority::getAuthority )
                .collect( Collectors.toSet() );

        return authorities;
    }

    private Auth0UserDetails getAuth0UserDetails()
    {
        final Auth0UserDetails principal = (Auth0UserDetails) getAuthenticationToken().getPrincipal();

        return principal;
    }

    private UserProfile getCurrentUserProfile()
    {
        return auth0Client.getUserProfile( getAuthenticationToken() );
    }

    private Auth0JWTToken getAuthenticationToken()
    {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return (Auth0JWTToken) authentication;
    }
}
