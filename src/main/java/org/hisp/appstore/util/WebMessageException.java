package org.hisp.appstore.util;

import org.hisp.appstore.api.support.WebMessage;

/**
 * Created by zubair on 14.12.16.
 */
public class WebMessageException extends Exception
{
    private WebMessage webMessage;

    public WebMessageException( WebMessage webMessage )
    {
        this.webMessage = webMessage;
    }

    public WebMessage getWebMessage()
    {
        return webMessage;
    }
}

