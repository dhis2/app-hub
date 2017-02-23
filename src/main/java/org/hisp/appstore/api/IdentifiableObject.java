package org.hisp.appstore.api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public interface IdentifiableObject
{
    int getId();

    void setId( int id );

    String getUid();

    void setUid( String uid );

    Date getCreated();

    void setCreated( Date created );

    Date getLastUpdated();

    void setLastUpdated( Date updated );

    void mergeWith( IdentifiableObject other );
}
