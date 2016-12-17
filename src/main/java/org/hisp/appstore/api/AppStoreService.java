package org.hisp.appstore.api;

import com.amazonaws.services.dynamodbv2.xspec.L;
import org.hisp.appstore.api.domain.*;
import org.springframework.web.multipart.MultipartFile;

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

    void updateApp( App app );

    void deleteApp( App app );

    int saveApp( App app );

    void setAppApproval( App app, AppStatus status);

    void removeReviewFromApp( App app, Review review );

    void addReviewToApp( App app, Review review );

    void addVersionToApp( App app, AppVersion version );

    void removeVersionFromApp( App app, AppVersion version );

    void upLoadApp( MultipartFile file );

    AppQueryParameters getParameterFromUrl( String requiredDhisVersion, AppStatus status, AppType type );
}
