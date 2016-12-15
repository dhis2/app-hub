package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.google.common.base.MoreObjects;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@JacksonXmlRootElement( localName = "user" )
public class User
    extends BaseIdentifiableObject
        implements Serializable
{
    private String username;

    private String firstName;

    private String lastName;

    private String password;

    private String email;

    private Set<String> auths = new HashSet<>();

    public User()
    {
    }

    public User( User user )
    {
        this.setAuths( user.getAuths() );
        this.setEmail( user.getEmail() );
        this.setFirstName( user.getFirstName() );
        this.setLastName( user.getLastName() );
        this.setPassword( user.getPassword() );
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

    @JsonIgnore
    public Set<GrantedAuthority> getUserDetails()
    {
        Set<GrantedAuthority> grantedAuths = new HashSet<GrantedAuthority>();

        for ( String auth : auths )
        {
            grantedAuths.add( new SimpleGrantedAuthority( auth ) );
        }

        return grantedAuths;
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

    @JsonIgnore
    public String getPassword()
    {
        return password;
    }

    public void setPassword( String password )
    {
        this.password = password;
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

    public void setAuths( Set<String> auths )
    {
        this.auths = auths;
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