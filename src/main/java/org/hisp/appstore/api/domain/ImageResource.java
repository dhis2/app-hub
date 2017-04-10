package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.base.MoreObjects;
import org.hisp.appstore.api.IdentifiableObject;

/**
 * Created by zubair on 25.02.17.
 */
public class ImageResource extends BaseIdentifiableObject
{
    private String caption;

    private String description;

    private String imageUrl;

    private boolean logo;

    private App app;

    @JsonProperty
    public String getCaption()
    {
        return caption;
    }

    public void setCaption( String caption )
    {
        this.caption = caption;
    }

    @JsonProperty
    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    @JsonProperty
    public boolean isLogo()
    {
        return logo;
    }

    public void setLogo( boolean logo )
    {
        this.logo = logo;
    }

    @JsonProperty
    public String getImageUrl()
    {
        return imageUrl;
    }

    public void setImageUrl( String imageUrl )
    {
        this.imageUrl = imageUrl;
    }

    @JsonIgnore
    public App getApp()
    {
        return app;
    }

    public void setApp( App app )
    {
        this.app = app;
    }


    @Override
    public void mergeWith( IdentifiableObject other )
    {
        ImageResource imageResource;

        if ( other.getClass().isInstance( this ) )
        {
            imageResource = (ImageResource) other;

            caption = imageResource.getCaption() != null ? imageResource.getCaption() : caption;
            description = imageResource.getDescription() != null ? imageResource.getDescription() : description;
            imageUrl = imageResource.getImageUrl() != null ? imageResource.getImageUrl() : imageUrl;
        }
    }

    @Override
    public String toString()
    {
        return MoreObjects.toStringHelper( this )
            .add( "uid", uid )
            .add( "caption", this.caption )
            .add( "imageUrl", this.imageUrl )
            .toString();
    }
}
