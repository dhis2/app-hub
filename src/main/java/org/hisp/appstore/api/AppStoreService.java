package org.hisp.appstore.api;

import com.amazonaws.services.dynamodbv2.xspec.L;
import org.hisp.appstore.api.domain.*;
import org.hisp.appstore.util.WebMessageException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Created by zubair on 01.12.16.
 */
public interface AppStoreService
{
    App getApp(int id );

    App getApp( String uid );

    List<App> get( AppQueryParameters queryParameters );

    List<App> getAllApps( );

    List<App> getAllAppsByStatus( AppStatus status );

    void updateApp( App app );

    void deleteApp( App app );

    int saveApp( App app );

    void setAppApproval( App app, AppStatus status);

    void removeReviewFromApp( App app, Review review );

    void addReviewToApp( App app, Review review );

    void addVersionToApp( App app, AppVersion version, MultipartFile file ) throws WebMessageException;

    void removeVersionFromApp( App app, AppVersion version ) throws WebMessageException;

    void uploadApp(  App app, MultipartFile file ) throws WebMessageException, IOException;

    void removeApp( App app );

    AppQueryParameters getParameterFromUrl( AppType type, String reqDhisVersion );
}
