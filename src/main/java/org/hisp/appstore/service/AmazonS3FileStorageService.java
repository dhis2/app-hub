package org.hisp.appstore.service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.FileStorageService;
import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

/**
 * Created by zubair on 28.12.16.
 */
public class AmazonS3FileStorageService implements FileStorageService
{
    private static final Log log = LogFactory.getLog( AmazonS3FileStorageService.class );

    private static final String BUCKET_NAME = "appstore.dhis2.org";

    private static final AppType DEFAULT_APPTYPE = AppType.APP_STANDARD;

    private static final ImmutableMap<AppType, String> TYPE_FOLDER_MAPPER = new ImmutableMap.Builder<AppType, String>()
            .put( AppType.APP_STANDARD, "apps-standard" )
            .put( AppType.APP_DASHBOARD, "apps-dashboard" )
            .put( AppType.APP_TRACKER_DASHBOARD, "apps-tracker-dashboard" )
            .build();

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private AmazonS3Client amazonS3Client;

    public void setAmazonS3Client( AmazonS3Client amazonS3Client )
    {
        this.amazonS3Client = amazonS3Client;
    }

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public void uploadFile( MultipartFile file, AppType type ) throws WebMessageException
    {
        String bucketAddress = BUCKET_NAME+ "/" + TYPE_FOLDER_MAPPER.get( ObjectUtils.defaultIfNull( type, DEFAULT_APPTYPE ));

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength( Long.valueOf( file.getSize() ));

        PutObjectResult result;

        try
        {
            result = amazonS3Client.putObject( bucketAddress, file.getOriginalFilename() , file.getInputStream() , metadata );
        }
        catch ( AmazonServiceException ase )
        {
            log.error( "Service Error " + ase.getErrorMessage() );

            throw new WebMessageException( WebMessageUtils.conflict( ase.getErrorMessage() ) );
        }
        catch ( AmazonClientException ace )
        {
            log.error( "Client Error " + ace.getMessage() );

            throw new WebMessageException( WebMessageUtils.conflict( ace.getMessage() ) );
        }
        catch ( IOException ioE)
        {
            log.error( "IOException " + ioE );

            throw new WebMessageException( WebMessageUtils.conflict( ioE.getMessage() ) );
        }

        log.info( " File Uploaded!! " );
    }
}
