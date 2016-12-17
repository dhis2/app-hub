package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.AppStatus;
import org.hisp.appstore.api.domain.AppType;

/**
 * Created by zubair on 17.12.16.
 */
public class AppQueryParameters
{
    private String reqDhisVersion;

    private AppType type;

    private AppStatus status;

    public AppQueryParameters()
    {
    }

    public String getReqDhisVersion()
    {
        return reqDhisVersion;
    }

    public void setReqDhisVersion( String reqDhisVersion )
    {
        this.reqDhisVersion = reqDhisVersion;
    }

    public AppType getType()
    {
        return type;
    }

    public void setType( AppType type )
    {
        this.type = type;
    }

    public AppStatus getStatus()
    {
        return status;
    }

    public void setStatus( AppStatus status )
    {
        this.status = status;
    }
}
