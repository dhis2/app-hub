package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import org.hisp.appstore.api.IdentifiableObject;
import org.hisp.appstore.util.CodeUtils;

import javax.persistence.*;
import java.util.Date;

@JacksonXmlRootElement( localName = "baseIdentifiableObject" )
public class BaseIdentifiableObject
    implements IdentifiableObject
{
    protected int id;

    protected String uid;

    protected Date created;

    @JsonProperty
    public int getId()
    {
        return id;
    }

    public void setId( int id )
    {
        this.id = id;
    }

    @JsonProperty
    public String getUid()
    {
        return uid;
    }

    public void setUid( String uid )
    {
        this.uid = uid;
    }

    @JsonProperty
    public Date getCreated()
    {
        return created;
    }

    public void setCreated( Date created )
    {
        this.created = created;
    }

    @Override
    public int hashCode()
    {
        int result = getUid() != null ? getUid().hashCode() : 0;

        return result;
    }

    @Override
    public boolean equals( Object o )
    {
        if ( this == o )
        {
            return true;
        }

        if ( o == null )
        {
            return false;
        }

        if ( !getClass().isAssignableFrom( o.getClass() ) )
        {
            return false;
        }

        final BaseIdentifiableObject other = (BaseIdentifiableObject) o;

        if ( getUid() != null ? !getUid().equals( other.getUid() ) : other.getUid() != null )
        {
            return false;
        }

        return true;
    }

    @Override
    public String toString()
    {
        return "[id='" + id + "', uid='" + uid + "', created='" + created + "']";
    }

    public void setAutoFields()
    {
        if ( getUid() == null )
        {
            setUid( CodeUtils.generateCode() );
        }

        if ( getCreated() == null )
        {
            setCreated( new Date() );
        }
    }
}
