package org.hisp.appstore.util;

import org.hisp.appstore.api.support.WebMessage;
import org.springframework.http.HttpStatus;

/**
 * Created by zubair on 14.12.16.
 */
public class WebMessageUtils
{
    public static WebMessage createWebMessage (String message, HttpStatus httpStatus )
    {
        WebMessage webMessage = new WebMessage();
        webMessage.setMessage( message );
        webMessage.setHttpStatus( httpStatus );

        return webMessage;
    }

    public static WebMessage ok ( String message )
    {
        return createWebMessage( message, HttpStatus.OK );
    }

    public static WebMessage created ( String message )
    {
        return createWebMessage( message, HttpStatus.CREATED );
    }

    public static WebMessage conflict ( String message )
    {
        return createWebMessage( message, HttpStatus.CONFLICT );
    }

    public static WebMessage notFound ( String message )
    {
        return createWebMessage( message, HttpStatus.NOT_FOUND );
    }

    public static WebMessage accepted ( String message )
    {
        return createWebMessage( message, HttpStatus.ACCEPTED );
    }

    public static WebMessage denied ( String message )
    {
        return  createWebMessage( message, HttpStatus.UNAUTHORIZED );
    }

    public static WebMessage forbidden ( String message )
    {
        return  createWebMessage( message, HttpStatus.FORBIDDEN );
    }
}
