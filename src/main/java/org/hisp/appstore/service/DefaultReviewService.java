package org.hisp.appstore.service;

import org.hisp.appstore.api.ReviewService;
import org.hisp.appstore.api.ReviewStore;
import org.hisp.appstore.api.domain.Review;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by zubair on 16.12.16.
 */
@Transactional
public class DefaultReviewService
        implements ReviewService
{
    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private ReviewStore reviewStore;

    public void setReviewStore( ReviewStore reviewStore )
    {
        this.reviewStore = reviewStore;
    }

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public int addReview( Review review )
    {
        return reviewStore.save( review );
    }

    @Override
    public void updateReview( Review review )
    {
        reviewStore.update( review );
    }

    @Override
    public void deleteReview( Review review )
    {
        reviewStore.delete( review );
    }

    @Override
    public Review getReview( int id )
    {
        return null;
    }

    @Override
    public Review getReview( String uid )
    {
        return reviewStore.get( uid );
    }

    @Override
    public List<Review> getAll()
    {
        return reviewStore.getAll();
    }
}
