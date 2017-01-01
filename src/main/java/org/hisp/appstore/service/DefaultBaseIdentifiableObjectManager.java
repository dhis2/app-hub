package org.hisp.appstore.service;

import com.google.common.collect.Maps;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.BaseIdentifiableObjectManager;
import org.hisp.appstore.api.GenericDao;
import org.hisp.appstore.api.domain.BaseIdentifiableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Set;
import java.util.List;
import java.util.Map;

/**
 * Created by zubair on 13.12.16.
 */
@Transactional
public class DefaultBaseIdentifiableObjectManager
        implements BaseIdentifiableObjectManager
{
    private static final Log log = LogFactory.getLog( DefaultBaseIdentifiableObjectManager.class );

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private List<GenericDao<? extends BaseIdentifiableObject>> baseIdentifiableStores;

    @Autowired
    public void setBaseIdentifiableStores( List<GenericDao<? extends BaseIdentifiableObject>> baseIdentifiableStores )
    {
        this.baseIdentifiableStores = baseIdentifiableStores;

        log.info( "Number of stores loaded : " + this.baseIdentifiableStores.size() );
    }

    private Map<Class<? extends BaseIdentifiableObject>, GenericDao<? extends BaseIdentifiableObject>> identifiableObjectStoreMap = Maps.newHashMap();

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public void save( BaseIdentifiableObject object )
    {
        GenericDao<BaseIdentifiableObject> store = getBaseIdentifiableStore( object.getClass() );

        if ( store != null )
        {
            store.save( object );
        }
    }

    @Override
    public void update( BaseIdentifiableObject object )
    {
        GenericDao<BaseIdentifiableObject> store = getBaseIdentifiableStore( object.getClass() );

        if ( store != null )
        {
            store.update( object );
        }
    }

    @Override
    public void delete( BaseIdentifiableObject object )
    {
        GenericDao<BaseIdentifiableObject> store = getBaseIdentifiableStore( object.getClass() );

        if ( store != null )
        {
            store.delete( object );
        }
    }

    @Override
    public <T extends BaseIdentifiableObject> T getByUid( Class<T> clazz, String uid )
    {
        for ( GenericDao<? extends BaseIdentifiableObject> store: baseIdentifiableStores )
        {
            T object = (T) store.get( uid );

            if (object != null)
            {
                return object;
            }
        }

        return null;
    }

    @Override
    public <T extends BaseIdentifiableObject> List<T> getAll( Class<T> clazz )
    {
        GenericDao<BaseIdentifiableObject> store = getBaseIdentifiableStore( clazz );

        if ( store == null )
        {
            return new ArrayList<>();
        }

        return (List<T>) store.getAll();
    }

    private <T extends BaseIdentifiableObject> GenericDao<BaseIdentifiableObject> getBaseIdentifiableStore( Class<T> clazz )
    {
        initMaps();

        GenericDao<? extends BaseIdentifiableObject> store = identifiableObjectStoreMap.get( clazz );

        if ( store == null )
        {
            log.info("Object store not found");

            return null;
        }

        return (GenericDao<BaseIdentifiableObject>) store;
    }

    private void initMaps ()
    {
        if ( !identifiableObjectStoreMap.isEmpty() )
        {
            return;
        }

        for( GenericDao<? extends BaseIdentifiableObject> store: baseIdentifiableStores )
        {
            identifiableObjectStoreMap.put( store.getClazz(), store );
        }
    }
}
