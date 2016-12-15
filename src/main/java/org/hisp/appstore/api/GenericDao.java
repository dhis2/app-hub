package org.hisp.appstore.api;

import java.util.List;

public interface GenericDao<T>
{
    /**
     * Class of the object for this store.
     */
    Class<T> getClazz();
    /**
     * Saves the given object instance.
     *
     * @param object the object instance.
     * @return the generated identifier.
     */
    int save( T object );

    /**
     * Updates the given object instance.
     *
     * @param object the object instance.
     */
    void update( T object );

    /**
     * Retrieves the object with the given identifier.
     *
     * @param id the object identifier.
     * @return the object identified by the given identifier.
     */
    T get( int id );

    /**
     * Retrieves the object with the given uid.
     *
     * @return the object identified by the given uid.
     */
    T get( String uid );

    /**
     * Retrieves the object with the given code. Assumes that there is a code
     * property on the relevant object with a uniqueness constraint.
     *
     * @param code the code.
     * @return the object with the given code.
     */
    T getByCode( String code );

    /**
     * Retrieves a Collection of all objects.
     *
     * @return a Collection of all objects.
     */
    List<T> getAll();

    /**
     * Removes the given object instance.
     *
     * @param object the object instance to delete.
     */
    void delete( T object );
}