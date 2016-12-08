package org.hisp.appstore.api;

/**
 * Created by zubair on 06.12.16.
 */
public interface UserStore extends GenericDao<User>
{
    User getUserByUsername( String userName );
}
