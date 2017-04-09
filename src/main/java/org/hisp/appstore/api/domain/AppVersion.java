package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hisp.appstore.api.IdentifiableObject;

/**
 * Created by zubair on 08.12.16.
 */
public class AppVersion
    extends BaseIdentifiableObject
{
    private String version;

    private String minDhisVersion;

    private String maxDhisVersion;

    private String downloadUrl;

    private String demoUrl;

    private App app;

    public AppVersion()
    {
    }

    @JsonProperty
    public String getVersion()
    {
        return version;
    }

    public void setVersion( String version )
    {
        this.version = version;
    }

    @JsonProperty
    public String getMinDhisVersion()
    {
        return minDhisVersion;
    }

    public void setMinDhisVersion( String minDhisVersion )
    {
        this.minDhisVersion = minDhisVersion;
    }

    @JsonProperty
    public String getMaxDhisVersion()
    {
        return maxDhisVersion;
    }

    public void setMaxDhisVersion( String maxDhisVersion )
    {
        this.maxDhisVersion = maxDhisVersion;
    }

    @JsonProperty
    public String getDownloadUrl()
    {
        return downloadUrl;
    }

    public void setDownloadUrl( String downloadUrl )
    {
        this.downloadUrl = downloadUrl;
    }

    @JsonProperty
    public String getDemoUrl()
    {
        return demoUrl;
    }

    public void setDemoUrl( String demoUrl )
    {
        this.demoUrl = demoUrl;
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
        AppVersion appVersion;

        if ( other.getClass().isInstance( this ))
        {
            appVersion = (AppVersion) other;

            version = appVersion.getVersion() != null ? appVersion.getVersion() : version;
            minDhisVersion = appVersion.getMinDhisVersion() != null ? appVersion.getMinDhisVersion() : minDhisVersion;
            maxDhisVersion = appVersion.getMaxDhisVersion() != null ? appVersion.getMaxDhisVersion() : maxDhisVersion;
            downloadUrl = appVersion.getDownloadUrl() != null ? appVersion.getDownloadUrl() : downloadUrl;
            demoUrl = appVersion.getDemoUrl() != null ? appVersion.getDemoUrl() : demoUrl;
        }
    }
}
