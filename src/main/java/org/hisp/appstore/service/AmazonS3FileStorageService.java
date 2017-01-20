package org.hisp.appstore.service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.FileStorageService;
import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.api.domain.FileUploadStatus;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * Created by zubair on 28.12.16.
 */
public class AmazonS3FileStorageService implements FileStorageService
{
    private static final Log log = LogFactory.getLog( AmazonS3FileStorageService.class );

    private static final String BUCKET_NAME = "appstore.dhis2.org";

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
    public FileUploadStatus uploadFile( MultipartFile file, AppType type ) throws WebMessageException
    {
        String bucketName = getBucketName( type );

        FileUploadStatus status = new FileUploadStatus();

        String resourceKey = UUID.randomUUID().toString();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength( Long.valueOf( file.getSize() ));

        PutObjectRequest request;

        try
        {
            request = new PutObjectRequest( bucketName, resourceKey, file.getInputStream(), metadata );
            request.setCannedAcl( CannedAccessControlList.PublicRead );

            amazonS3Client.putObject( request );

            status.setUploaded( true );
            status.setDownloadUrl( amazonS3Client.getResourceUrl( bucketName, resourceKey ) );
        }
        catch ( AmazonServiceException ase )
        {
            log.error( "Service Error " + ase );

            throw new WebMessageException( WebMessageUtils.conflict( ase.getErrorMessage() ) );
        }
        catch ( AmazonClientException ace )
        {
            log.error( "Client Error " + ace );

            throw new WebMessageException( WebMessageUtils.conflict( ace.getMessage() ) );
        }
        catch ( IOException ioE )
        {
            log.error( "IOException " + ioE );

            throw new WebMessageException( WebMessageUtils.conflict( ioE.getMessage() ) );
        }

        log.info( " File Uploaded " );

        return status;
    }

    @Override
    public void deleteFile( AppType type, String key )
    {
        String bucketName = getBucketName( type );

        amazonS3Client.deleteObject( bucketName, key );
    }

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    private String getBucketName( AppType type )
    {
        return BUCKET_NAME+ "/" + TYPE_FOLDER_MAPPER.get( type );
    }
}
