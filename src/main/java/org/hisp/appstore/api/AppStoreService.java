package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.domain.AppStatus;
import org.hisp.appstore.api.domain.Review;

import java.util.List;

/**
 * Created by zubair on 01.12.16.
 */
public interface AppStoreService
{
    App getApp(int id );

    App getApp( String uid );

    List<App> getAllApps( );

    void updateApp( App app );

    void deleteApp( App app );

    int saveApp( App app );

    void setAppApproval ( App app, AppStatus status);

    void removeReviewFromApp( App app, Review review );

    void addReviewToApp(  App app, Review review );
}
