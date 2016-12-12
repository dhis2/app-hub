package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

/**
 * Created by zubair on 08.12.16.
 */
@JacksonXmlRootElement( localName = "appversion" )
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

    @JsonProperty
    public App getApp()
    {
        return app;
    }

    public void setApp(App app)
    {
        this.app = app;
    }
}
