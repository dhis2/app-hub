package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by zubair on 23.11.16.
 */
public class Review
    extends BaseIdentifiableObject
{
    private String userId;

    private String reviewText;

    private int rate;

    public Review()
    {
    }

    public Review( String userId, String reviewText )
    {
        this.userId = userId;
        this.reviewText = reviewText;
    }

    @JsonProperty
    public String getUserId()
    {
        return userId;
    }

    public void setUserId( String userId )
    {
        this.userId = userId;
    }

    @JsonProperty
    public String getReviewText()
    {
        return reviewText;
    }

    public void setReviewText( String reviewText )
    {
        this.reviewText = reviewText;
    }

    @JsonProperty
    public int getRate()
    {
        return rate;
    }

    public void setRate( int rate )
    {
        this.rate = rate;
    }
}
