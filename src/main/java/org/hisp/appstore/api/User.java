package org.hisp.appstore.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table( name = "useraccount" )
public class User
    extends BaseIdentifiableObject
{
    @Column(nullable=false, unique=true)
    @JsonProperty
    private String username;

    @Column(nullable=false)
    private String password;

    @Column(nullable=false)
    @JsonProperty
    private String email;

    @ElementCollection
    @JsonProperty
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

    @JsonIgnore
    public UserDetails getUserDetails()
    {
        Set<GrantedAuthority> grantedAuths = new HashSet<GrantedAuthority>();

        for ( String auth : auths )
        {
            grantedAuths.add( new SimpleGrantedAuthority( auth ) );
        }

        return new org.springframework.security.core.userdetails.User( username, password, grantedAuths );
    }

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

    @JsonProperty
    public void setPassword( String password )
    {
        this.password = password;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail( String email )
    {
        this.email = email;
    }

    public Set<String> getAuths()
    {
        return auths;
    }

    public void setAuths( Set<String> auths )
    {
        this.auths = auths;
    }
}