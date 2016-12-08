package org.hisp.appstore.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.RenderService;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by zubair on 01.12.16.
 */
public class DefaultRenderService implements RenderService
{
    private static Log log = LogFactory.getLog( DefaultRenderService.class );

    private static final ObjectMapper jsonMapper = new ObjectMapper();

    private static final XmlMapper xmlMapper = new XmlMapper();

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
}
