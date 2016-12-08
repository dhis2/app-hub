package org.hisp.appstore.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.google.common.collect.Sets;

import javax.xml.crypto.Data;
import java.util.Set;

/**
 * Created by lars on 07.11.16.
 */
@JacksonXmlRootElement( localName = "app" )
public class App
    extends BaseIdentifiableObject
{
    private String name;

    private String functionalityDescription;

    private Set<String> features = Sets.newHashSet();

    private Data updated;

    private long installs;

    private String currentVersion;

    private String requiredDhisVersion;

    private Developer developer;

    private User owner;

    private AppType appType;

    private Set<Review> reviews = Sets.newHashSet();

    @JsonProperty
    public String getName()
    {
        return name;
    }

    public void setName( String name )
    {
        this.name = name;
    }

    @JsonProperty
    public String getFunctionalityDescription()
    {
        return functionalityDescription;
    }

    public void setFunctionalityDescription( String functionalityDescription )
    {
        this.functionalityDescription = functionalityDescription;
    }

    @JsonProperty
    public Set<String> getFeatures()
    {
        return features;
    }

    public void setFeatures( Set<String> features )
    {
        this.features = features;
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
    public long getInstalls()
    {
        return installs;
    }

    public void setInstalls( long installs )
    {
        this.installs = installs;
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
}