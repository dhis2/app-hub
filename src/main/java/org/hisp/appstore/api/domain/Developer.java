package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.google.common.collect.Sets;

import java.util.Set;

/**
 * Created by zubair on 01.12.16.
 */
public class Developer
{
    private String developerName;

    private String organisation;

    private String address;

    private String email;

    public Developer()
    {
    }

    @JsonProperty( value = "name" )
    public String getDeveloperName()
    {
        return developerName;
    }

    public void setDeveloperName( String developerName )
    {
        this.developerName = developerName;
    }

    @JsonProperty( value = "organisation" )
    public String getOrganisation()
    {
        return organisation;
    }

    public void setOrganisation( String organisation )
    {
        this.organisation = organisation;
    }

    @JsonProperty( value = "email" )
    public String getEmail()
    {
        return email;
    }

    public void setEmail( String email )
    {
        this.email = email;
    }

    @JsonProperty( value = "address" )
    public String getAddress()
    {
        return address;
    }

    public void setAddress( String address )
    {
        this.address = address;
    }
}
