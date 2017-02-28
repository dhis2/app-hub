package org.hisp.appstore.store;

import org.hisp.appstore.api.ImageResourceStore;
import org.hisp.appstore.api.domain.ImageResource;
import org.hisp.appstore.util.HibernateGenericDao;

/**
 * Created by zubair on 25.02.17.
 */
public class HibernateImageResourceStore
        extends HibernateGenericDao<ImageResource> implements ImageResourceStore
{
}
