package org.hisp.appstore.api;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.api.domain.ResourceType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by zubair on 25.02.17.
 */
public abstract class PutObjectRequestService
{
    protected static final String BASE_BUCKET = "dhis2-appstore";
    protected static final String AMAZON_URL = "s3.amazonaws.com";

    protected ObjectMetadata getMetaData( MultipartFile file )
    {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength( Long.valueOf( file.getSize() ) );
        return metadata;
    }

    public abstract boolean accepts( ResourceType type );

    public abstract PutObjectRequest getPutObjectRequest( MultipartFile file, AppType appType, String resourceKey ) throws IOException;

    public abstract String getDownloadUrl( AppType appType, String resourceKey );

    public abstract String getBucketName( AppType appType );

    public abstract boolean isFormatSupported( MultipartFile file );
}
