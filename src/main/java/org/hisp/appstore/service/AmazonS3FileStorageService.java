package org.hisp.appstore.service;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.google.common.collect.ImmutableMap;
import com.google.common.io.Files;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.FileStorageService;
import org.hisp.appstore.api.PutObjectRequestService;
import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.api.domain.FileUploadStatus;
import org.hisp.appstore.api.domain.ResourceType;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Created by zubair on 28.12.16.
 */
public class AmazonS3FileStorageService implements FileStorageService
{
    private static final Log log = LogFactory.getLog( AmazonS3FileStorageService.class );

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    private AmazonS3Client amazonS3Client;

    public void setAmazonS3Client( AmazonS3Client amazonS3Client )
    {
        this.amazonS3Client = amazonS3Client;
    }

    private List<PutObjectRequestService> putObjectRequestCreators;

    public void setPutObjectRequestCreators( List<PutObjectRequestService> putObjectRequestCreators )
    {
        this.putObjectRequestCreators = putObjectRequestCreators;
    }

    // -------------------------------------------------------------------------
    // Implementation methods
    // -------------------------------------------------------------------------

    @Override
    public FileUploadStatus uploadFile( MultipartFile file, AppType type, ResourceType resourceType )
                                        throws WebMessageException, IOException
    {
        String resourceKey = UUID.randomUUID().toString() + "." + resourceType.toString().toLowerCase();

        String downloadUrl = StringUtils.EMPTY;

        PutObjectRequest request = null;

        FileUploadStatus status = new FileUploadStatus();

        if ( file == null )
        {
            status.setUploaded( false );

            return status;
        }

        for( PutObjectRequestService putObjectRequestService : putObjectRequestCreators )
        {
            if ( putObjectRequestService.accepts( resourceType ))
            {
                if ( putObjectRequestService.isFormatSupported( file ) )
                {
                    request = putObjectRequestService.getPutObjectRequest( file, type, resourceKey );

                    downloadUrl = putObjectRequestService.getDownloadUrl( type, resourceKey );
                }
                else
                {
                    throw new WebMessageException( WebMessageUtils.conflict( String.format( "File format %s not supported",
                            Files.getFileExtension( file.getOriginalFilename() ) ) ) );
                }
            }
        }

        try
        {
            amazonS3Client.putObject( request );

            status.setUploaded( true );
            status.setDownloadUrl( downloadUrl );
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

        log.info( String.format( "%s file uploaded!", resourceType.toString() ) );

        return status;
    }

    @Override
    public void deleteFile( AppType type, String key, ResourceType resourceType )
    {
        String bucketName = StringUtils.EMPTY;

        for( PutObjectRequestService putObjectRequestService : putObjectRequestCreators )
        {
            if ( putObjectRequestService.accepts( resourceType ))
            {
                bucketName = putObjectRequestService.getBucketName( type );
            }
        }

        amazonS3Client.deleteObject( bucketName, key );
    }
}
