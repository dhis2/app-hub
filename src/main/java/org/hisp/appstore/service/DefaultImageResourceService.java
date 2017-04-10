package org.hisp.appstore.service;

import org.hisp.appstore.api.ImageResourceService;
import org.hisp.appstore.api.ImageResourceStore;
import org.hisp.appstore.api.domain.ImageResource;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by zubair on 25.02.17.
 */
@Transactional
public class DefaultImageResourceService implements ImageResourceService
{
    private ImageResourceStore imageResourceStore;

    public void setImageResourceStore( ImageResourceStore imageResourceStore )
    {
        this.imageResourceStore = imageResourceStore;
    }

    @Override
    public ImageResource get( int id )
    {
        return imageResourceStore.get( id );
    }

    @Override
    public ImageResource get( String uid )
    {
        return imageResourceStore.get( uid );
    }

    @Override
    public void update( ImageResource imageResource )
    {
        imageResourceStore.update( imageResource );
    }

    @Override
    public void delete( ImageResource imageResource )
    {
        imageResourceStore.delete( imageResource );
    }
}
