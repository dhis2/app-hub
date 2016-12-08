package org.hisp.appstore.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import org.hisp.appstore.api.BaseIdentifiableObject;

import java.util.Set;

/**
 * Created by zubair on 01.12.16.
 */
@JacksonXmlRootElement(localName = "developer")
public class Developer
        extends BaseIdentifiableObject
{
    private String name;

    private String organisation;

    private String address;

    private Set<String> emails;

    public Developer() {
    }

    @JsonProperty
    public String getName() {
        return name;
    }

    public void setName( String name ) {
        this.name = name;
    }

    @JsonProperty
    public String getOrganisation() {
        return organisation;
    }

    public void setOrganisation( String organisation ) {
        this.organisation = organisation;
    }

    @JsonProperty
    public String getAddress() {
        return address;
    }

    public void setAddress( String address ) {
        this.address = address;
    }

    @JsonProperty
    public Set<String> getEmails()
    {
        return emails;
    }

    public void setEmails( Set<String> emails )
    {
        this.emails = emails;
    }
}
