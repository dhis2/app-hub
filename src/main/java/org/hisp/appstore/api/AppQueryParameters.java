package org.hisp.appstore.api;

import org.apache.commons.lang3.StringUtils;
import org.hisp.appstore.api.domain.AppStatus;
import org.hisp.appstore.api.domain.AppType;

/**
 * Created by zubair on 17.12.16.
 */
public class AppQueryParameters
{
    private java.lang.String reqDhisVersion = StringUtils.EMPTY;

    private AppType type;

    public AppQueryParameters()
    {
    }

    public boolean hasType()
    {
        return type != null;
    }

    public boolean hasReqDhisVersion()
    {
        return !StringUtils.EMPTY.equals( reqDhisVersion );
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
}
