package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.User;

/**
 * Created by zubair on 06.12.16.
 */
public interface UserStore extends GenericDao<User>
{
    User getUserByUsername( String userName );

    User getCurrentUser();
}
