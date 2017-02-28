package org.hisp.appstore.service;

import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.google.common.collect.ImmutableMap;
import com.google.common.io.Files;
import org.hisp.appstore.api.PutObjectRequestService;
import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.api.domain.ResourceType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Created by zubair on 25.02.17.
 */
public class ImagePutObjectRequestService
        extends PutObjectRequestService
{
    private static final ImmutableMap<AppType, String> IMAGE_FOLDER_MAPPER = new ImmutableMap.Builder<AppType, String>()
            .put( AppType.APP_STANDARD, "images-standard" )
            .put( AppType.APP_DASHBOARD, "images-dashboard" )
            .put( AppType.APP_TRACKER_DASHBOARD, "images-tracker-dashboard" )
            .build();

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public boolean accepts( ResourceType type )
    {
        return ResourceType.IMAGE.equals( type );
    }

    @Override
    public PutObjectRequest getPutObjectRequest( MultipartFile file, AppType appType, String resourceKey )
            throws IOException
    {
        PutObjectRequest request;

        request = new PutObjectRequest( getBucketName( appType ), resourceKey, file.getInputStream(), getMetaData( file ) );
        request.setCannedAcl( CannedAccessControlList.PublicRead );

        return request;
    }

    @Override
    public String getDownloadUrl( AppType appType, String resourceKey )
    {
        return "https://" + BASE_BUCKET + "." + AMAZON_URL + "/" + IMAGE_FOLDER_MAPPER.get( appType ) + "/" + resourceKey;
    }

    @Override
    public String getBucketName( AppType type )
    {
        return BASE_BUCKET+ "/" + IMAGE_FOLDER_MAPPER.get( type );
    }

    @Override
    public boolean isFormatSupported( MultipartFile file )
    {
        return FILE_EXTENTION.contains( Files.getFileExtension( file.getOriginalFilename() ) );
    }
}
