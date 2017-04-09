package org.hisp.appstore.api.domain;

import java.io.Serializable;
import java.util.Set;

import org.hisp.appstore.api.IdentifiableObject;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Sets;

/**
 * Created by lars on 07.11.16.
 */
public class App
    extends BaseIdentifiableObject implements Serializable
{
    private String name;

    private String description;

    private Developer developer;

    private String owner;

    private AppType appType = AppType.APP_STANDARD;

    private Set<AppVersion> versions = Sets.newHashSet();

    private Set<Review> reviews = Sets.newHashSet();

    private Set<ImageResource> images = Sets.newHashSet();

    private AppStatus status = AppStatus.PENDING;

    public App()
    {
    }

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
    public String getDescription()
    {
        return description;
    }

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
    public String getOwner()
    {
        return owner;
    }

    public void setOwner( String owner )
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

    @JsonProperty
    public Set<ImageResource> getImages()
    {
        return images;
    }

    public void setImages( Set<ImageResource> images )
    {
        this.images = images;
    }

    @Override
    public void mergeWith( IdentifiableObject other )
    {
        App app;

        if ( other.getClass().isInstance( this ))
        {
            app = (App) other;

            name = app.getName() != null ? app.getName() : name;
            description = app.getDescription() != null ? app.getDescription() : description;
            developer = app.getDeveloper() != null ? app.getDeveloper() : developer;
            owner = app.getOwner() != null ? app.getOwner() : owner;
            appType = app.getAppType() != null ? app.getAppType() : appType;
            status = app.getStatus() != null ? app.getStatus() : status;
        }
    }
}