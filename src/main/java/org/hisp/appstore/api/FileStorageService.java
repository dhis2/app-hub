package org.hisp.appstore.api;

import org.hisp.appstore.api.domain.AppType;
import org.hisp.appstore.util.WebMessageException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Created by zubair on 28.12.16.
 */
public interface FileStorageService
{
    void uploadFile(MultipartFile file, AppType type ) throws WebMessageException;
}
