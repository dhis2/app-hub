package org.hisp.appstore.api.domain;

import com.auth0.Auth0User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.google.common.base.MoreObjects;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

public class User
    extends BaseIdentifiableObject
        implements Serializable
{
    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private Set<String> auths = new HashSet<>();

    public User()
    {
    }

    public void mergeWith( User other )
    {
        // Do not merge user name and password

        if ( other != null )
        {
            this.email = other.email;

            if ( other.getAuths() != null )
            {
                this.auths.clear();
                this.auths.addAll( other.getAuths() );
            }
        }
    }

    public void mergeWith( Auth0User auth0User )
    {
        if ( auth0User != null )
        {
            this.email = auth0User.getEmail();
            this.firstName = auth0User.getGivenName();
            this.lastName = auth0User.getFamilyName();
            this.username = auth0User.getName();

            if( auth0User.getRoles() != null && !auth0User.getRoles().isEmpty() )
            {
                this.auths.clear();
                this.auths.addAll( auth0User.getRoles() );
            }
        }
    }

    @JsonProperty
    public String getUsername()
    {
        return username;
    }

    public void setUsername( String username )
    {
        this.username = username;
    }

    @JsonProperty
    public String getEmail()
    {
        return email;
    }

    public void setEmail( String email )
    {
        this.email = email;
    }

    @JsonProperty
    public String getFirstName()
    {
        return firstName;
    }

    public void setFirstName( String firstName )
    {
        this.firstName = firstName;
    }

    @JsonProperty
    public String getLastName()
    {
        return lastName;
    }

    public void setLastName( String lastName )
    {
        this.lastName = lastName;
    }

    @JsonIgnore
    public Set<String> getAuths()
    {
        return auths;
    }

    @JsonProperty
    public void setAuths( Set<String> auths )
    {
        this.auths = auths;
    }

    @JsonProperty( value = "manager" )
    public boolean isManager()
    {
        return this.auths.contains( "ROLE_MANAGER" );
    }

    @Override
    public String toString()
    {
        return MoreObjects.toStringHelper( this )
                .add( "uid", uid )
                .add( "username", this.username )
                .add( "firstname", this.firstName )
                .add( "lastname", this.lastName )
                .add( "email", this.email )
                .toString();
    }
}