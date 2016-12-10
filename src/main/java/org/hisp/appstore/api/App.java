package org.hisp.appstore.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import javax.xml.crypto.Data;
import java.util.List;
import java.util.Set;

/**
 * Created by lars on 07.11.16.
 */
@JacksonXmlRootElement( localName = "app" )
public class App
    extends BaseIdentifiableObject
{
    private String appName;

    private String description;

    private Data updated;

    private String currentVersion;

    private String requiredDhisVersion;

    private Developer developer;

    private User owner;

    private AppType appType;

    private List<AppVersion> versions = Lists.newArrayList();

    private Set<Review> reviews = Sets.newHashSet();

    @JsonProperty
    public String getAppName()
    {
        return appName;
    }

    public void setAppName( String name )
    {
        this.appName = appName;
    }

    @JsonProperty
    public String getDescription()
    {
        return description;
    }

    public void setDescription( String description )
    {
        this.description = description;
    }

    @JsonProperty
    public Data getUpdated()
    {
        return updated;
    }

    public void setUpdated( Data updated )
    {
        this.updated = updated;
    }

    @JsonProperty
    public String getCurrentVersion()
    {
        return currentVersion;
    }

    public void setCurrentVersion( String currentVersion )
    {
        this.currentVersion = currentVersion;
    }

    @JsonProperty
    public String getRequiredDhisVersion()
    {
        return requiredDhisVersion;
    }

    public void setRequiredDhisVersion( String requiredDhisVersion )
    {
        this.requiredDhisVersion = requiredDhisVersion;
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
    public List<AppVersion> getVersions()
    {
        return versions;
    }

    public void setVersions( List<AppVersion> version )
    {
        this.versions = versions;
    }
}