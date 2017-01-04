package org.hisp.appstore.api.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by zubair on 03.01.17.
 */
public class FileUploadStatus
{
    private String downloadUrl = StringUtils.EMPTY;

    private boolean uploaded = false;

    @JsonProperty
    public String getDownloadUrl()
    {
        return downloadUrl;
    }

    public void setDownloadUrl( String downloadUrl )
    {
        this.downloadUrl = downloadUrl;
    }

    @JsonProperty
    public boolean isUploaded()
    {
        return uploaded;
    }

    public void setUploaded( boolean uploaded )
    {
        this.uploaded = uploaded;
    }
}
