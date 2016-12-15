package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.BaseIdentifiableObject;

import java.util.List;

/**
 * Created by zubair on 13.12.16.
 */
public interface BaseIdentifiableObjectManager
{
    void save( BaseIdentifiableObject object );

    void update( BaseIdentifiableObject object );

    void delete( BaseIdentifiableObject object );

    <T extends BaseIdentifiableObject> T getByUid ( Class<T> clazz, String uid );

    <T extends BaseIdentifiableObject> List<T> getAll( Class<T> clazz );
}
