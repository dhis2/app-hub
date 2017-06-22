package org.hisp.appstore.api.domain;

import com.google.common.collect.Sets;

import java.util.Set;

/**
 * Created by zubair on 25.02.17.
 */
public enum ResourceType
{
    IMAGE( Sets.newHashSet( "jpg", "jpeg", "png" ) ), ZIP( Sets.newHashSet( "zip" ) );

    ResourceType( Set<String> keys )
    {
        this.keys = keys;
    }

    private Set<String> keys;

    public Set<String> getKeys()
    {
        return keys;
    }

    public void setKeys( Set<String> keys )
    {
        this.keys = keys;
    }
}
