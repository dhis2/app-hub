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

    private String developerOrganisation;

    private String developerAddress;

    private String deverloperEmailAddress;

    public Developer()
    {
    }

    @JsonProperty
    public String getDeveloperName()
    {
        return developerName;
    }

    public void setDeveloperName( String developerName )
    {
        this.developerName = developerName;
    }

    @JsonProperty
    public String getDeveloperOrganisation()
    {
        return developerOrganisation;
    }

    public void setDeveloperOrganisation( String developerOrganisation )
    {
        this.developerOrganisation = developerOrganisation;
    }

    @JsonProperty
    public String getDeverloperEmailAddress()
    {
        return deverloperEmailAddress;
    }

    public void setDeverloperEmailAddress( String deverloperEmailAddress )
    {
        this.deverloperEmailAddress = deverloperEmailAddress;
    }

    @JsonProperty
    public String getDeveloperAddress()
    {
        return developerAddress;
    }

    public void setDeveloperAddress( String developerAddress )
    {
        this.developerAddress = developerAddress;
    }
}
