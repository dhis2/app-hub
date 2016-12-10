package org.hisp.appstore.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import java.util.HashSet;
import java.util.Set;

@JacksonXmlRootElement( localName = "user" )
public class User
    extends BaseIdentifiableObject
{
    @Column(nullable=false, unique=true)
    @JsonProperty
    private String username;

    private String firstName;

    private String lastName;

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

    @JsonProperty
    public String getUsername()
    {
        return username;
    }

    public void setUsername( String username )
    {
        this.username = username;
    }

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

    public Set<String> getAuths()
    {
        return auths;
    }

    public void setAuths( Set<String> auths )
    {
        this.auths = auths;
    }
}