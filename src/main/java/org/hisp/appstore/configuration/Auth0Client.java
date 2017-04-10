package org.hisp.appstore.configuration;

import com.auth0.Auth0;
import com.auth0.authentication.AuthenticationAPIClient;
import com.auth0.authentication.result.UserProfile;
import com.auth0.request.Request;
import com.auth0.spring.security.api.Auth0JWTToken;
import org.springframework.stereotype.Component;

@Component
public class Auth0Client
{
    private final String clientid;

    private final String domain;

    private final Auth0 auth0;

    private final AuthenticationAPIClient client;

    public Auth0Client( String clientid, String domain )
    {
        this.clientid = clientid;
        this.domain = domain;
        this.auth0 = new Auth0( clientid, domain );
        this.client = this.auth0.newAuthenticationAPIClient();
    }

    public String getUserEmail( Auth0JWTToken token )
    {
        Request<UserProfile> request = client.tokenInfo( token.getJwt() );

        UserProfile profile = request.execute();

        return profile.getEmail();
    }

    public UserProfile getUserProfile( Auth0JWTToken token )
    {
        Request<UserProfile> request = client.tokenInfo( token.getJwt() );

        UserProfile profile = request.execute();

        return profile;
    }

    public String getClientid()
    {
        return clientid;
    }

    public String getDomain()
    {
        return domain;
    }
}
