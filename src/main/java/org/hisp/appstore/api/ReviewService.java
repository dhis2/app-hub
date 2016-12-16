package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.Review;

import java.util.List;

/**
 * Created by zubair on 16.12.16.
 */
public interface ReviewService
{
    int addReview( Review review );

    void updateReview( Review review );

    void deleteReview( Review review );

    Review getReview( int id );

    Review getReview( String uid );

    List<Review> getAll();
}
