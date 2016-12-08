package org.hisp.appstore.api;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by zubair on 01.12.16.
 */
public interface RenderService
{
    void toJson (OutputStream outputStream, Object value) throws IOException;

    <T> T fromJson (InputStream inputStream, Class<T> klass ) throws IOException;
}
