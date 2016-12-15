package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.User;

import java.util.List;

/**
 * Created by zubair on 02.12.16.
 */
public interface UserService
{
    int addUser( User user );

    void deleteUser( User user );

    void updateUser( User user );

    User getUser( int id );

    List<User> getAll();
}
