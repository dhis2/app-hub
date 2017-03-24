package org.hisp.appstore.api.domain;

/**
 * Created by zubair on 25.02.17.
 */
public enum ResourceType
{
    IMAGE( "jpg" ), ZIP( "zip" );

    ResourceType( String key )
    {
        this.key = key;
    }

    private String key;

    public String getKey()
    {
        return key;
    }

    public void setKey( String key )
    {
        this.key = key;
    }
}
