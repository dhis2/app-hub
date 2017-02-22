package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import javax.xml.crypto.Data;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

/**
 * Created by lars on 07.11.16.
 */
public class App
    extends BaseIdentifiableObject
        implements Serializable
{
    private String appName;

    private String description;

    private Developer developer;

    private User owner;

    private AppType appType = AppType.APP_STANDARD;

    private Set<AppVersion> versions = Sets.newHashSet();

    private Set<Review> reviews = Sets.newHashSet();

    private AppStatus status = AppStatus.PENDING;

    public App()
    {
    }

    @JsonProperty
    public String getAppName()
    {
        return appName;
    }

    public void setAppName( String appName )
    {
        this.appName = appName;
    }

    @JsonProperty
    public String getDescription()
    {
        return description;
    }
ß
    public void setDescription( String description )
    {
        this.description = description;
    }

    @JsonProperty
    public Developer getDeveloper()
    {
        return developer;
    }

    public void setDeveloper( Developer developer )
    {
        this.developer = developer;
    }

    @JsonProperty
    public User getOwner()
    {
        return owner;
    }

    public void setOwner( User owner )
    {
        this.owner = owner;
    }

    @JsonProperty
    public Set<Review> getReviews()
    {
        return reviews;
    }

    public void setReviews( Set<Review> reviews )
    {
        this.reviews = reviews;
    }

    @JsonProperty
    public AppType getAppType( )
    {
        return appType;
    }

    public void setAppType( AppType type )
    {
        this.appType = type;
    }

    @JsonProperty
    public Set<AppVersion> getVersions()
    {
        return versions;
    }

    public void setVersions( Set<AppVersion> versions )
    {
        this.versions = versions;
    }

    @JsonProperty
    public AppStatus getStatus()
    {
        return status;
    }

    public void setStatus( AppStatus status )
    {
        this.status = status;
    }
}