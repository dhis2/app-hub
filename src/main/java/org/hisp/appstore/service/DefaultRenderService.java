package org.hisp.appstore.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.RenderService;
import org.hisp.appstore.api.support.WebMessage;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.http.MediaType;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by zubair on 01.12.16.
 */
public class DefaultRenderService
        implements RenderService
{
    private static Log log = LogFactory.getLog( DefaultRenderService.class );

    private static final ObjectMapper jsonMapper = new ObjectMapper();

    @Override
    public void toJson( OutputStream outputStream, Object value ) throws IOException
    {
        jsonMapper.writeValue( outputStream , value );
    }

    @Override
    public <T> T fromJson( InputStream inputStream, Class<T> klass ) throws IOException
    {
        return jsonMapper.readValue( inputStream, klass );
    }

    @Override
    public void renderOk( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException
    {
        WebMessage webMessage = WebMessageUtils.ok( message );

        send( response, request, webMessage );
    }

    @Override
    public void renderCreated( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException
    {
        WebMessage webMessage = WebMessageUtils.created( message );

        send( response, request, webMessage );
    }

    @Override
    public void renderAccepted ( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException
    {
        WebMessage webMessage = WebMessageUtils.accepted( message );

        send( response, request, webMessage );
    }

    @Override
    public void renderConflict ( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException
    {
        WebMessage webMessage = WebMessageUtils.conflict( message );

        send( response, request, webMessage );
    }

    @Override
    public void renderNotFound ( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException
    {
        WebMessage webMessage = WebMessageUtils.notFound( message );

        send( response, request, webMessage );
    }

    @Override
    public void send ( HttpServletResponse response, HttpServletRequest request, WebMessage webMessage ) throws IOException
    {
        response.setStatus( webMessage.getHttpStatusCode() );
        response.setContentType( MediaType.APPLICATION_JSON_VALUE );

        toJson( response.getOutputStream(), webMessage );
    }
}
