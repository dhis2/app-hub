package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

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

    private Set<String> emailAddresses;

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
    public Set<String> getEmailAddresses()
    {
        return emailAddresses;
    }

    public void setEmailAddresses( Set<String> emails )
    {
        this.emailAddresses = emailAddresses;
    }
}
