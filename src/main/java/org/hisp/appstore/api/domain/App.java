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
import org.hisp.appstore.api.IdentifiableObject;

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
    private String name;

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

            versions = app.getVersions() != null && !app.getVersions().isEmpty() ? app.getVersions() : versions;
            reviews = app.getReviews() != null && !app.getReviews().isEmpty() ? app.getReviews() : reviews;
        }
    }
}