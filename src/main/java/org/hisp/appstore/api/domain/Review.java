package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

/**
 * Created by zubair on 23.11.16.
 */
@JacksonXmlRootElement(localName = "review")
public class Review
        extends BaseIdentifiableObject
{
    private User user;

    private String reviewText;

    private int rate;

    private App app;

    public Review() {
    }

    public Review( User user, String reviewText )
    {
        this.user = user;
        this.reviewText = reviewText;
    }

    @JsonProperty
    public User getUser() {
        return user;
    }

    public void setUser( User user ) {
        this.user = user;
    }

    @JsonProperty
    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText( String reviewText ) {
        this.reviewText = reviewText;
    }

    @JsonProperty
    public int getRate() {
        return rate;
    }

    public void setRate( int rate )
    {
        this.rate = rate;
    }

    @JsonProperty
    public App getApp()
    {
        return app;
    }

    public void setApp( App app )
    {
        this.app = app;
    }
}
