package org.hisp.appstore.api;

import com.amazonaws.services.dynamodbv2.xspec.L;
import org.hisp.appstore.api.domain.App;
import org.hisp.appstore.api.domain.AppStatus;
import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.api.domain.Review;
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

    void setAppApproval ( App app, AppStatus status);

    void removeReviewFromApp( App app, Review review );

    void addReviewToApp(  App app, Review review );

    void upLoadApp( MultipartFile file );

    AppQueryParameters getParameterFromUrl( String requiredDhisVersion, AppStatus status, AppType type );
}
