package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.api.domain.FileUploadStatus;
import org.hisp.appstore.api.domain.ResourceType;
import org.hisp.appstore.util.WebMessageException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Created by zubair on 28.12.16.
 */
public interface FileStorageService
{
    FileUploadStatus uploadFile(MultipartFile file, AppType type, ResourceType resourceType )
            throws WebMessageException, IOException;

    void deleteFile( AppType type, String key, ResourceType resourceType );
}
