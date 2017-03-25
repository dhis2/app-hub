package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.ImageResource;

/**
 * Created by zubair on 25.02.17.
 */
public interface ImageResourceService
{
    ImageResource get( int id );

    ImageResource get( String uid );

    void update( ImageResource imageResource );

    void delete( ImageResource imageResource );
}
