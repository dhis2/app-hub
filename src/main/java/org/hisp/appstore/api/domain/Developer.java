package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import com.google.common.collect.Sets;

import java.util.Set;

/**
 * Created by zubair on 01.12.16.
 */
public class Developer
        extends BaseIdentifiableObject
{
    private String developerName;

    private String organisation;

    private String address;

    private Set<String> emailAddresses = Sets.newHashSet();

    public Developer()
    {
    }

    @JsonProperty
    public String getDeveloperName()
    {
        return developerName;
    }

    public void setDeveloperName( String developerName )
    {
        this.developerName = developerName;
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

    public void setAddress( String address )
    {
        this.address = address;
    }

    @JsonProperty
    public Set<String> getEmailAddresses()
    {
        return emailAddresses;
    }

    public void setEmailAddresses( Set<String> emailAddresses )
    {
        this.emailAddresses = emailAddresses;
    }
}
