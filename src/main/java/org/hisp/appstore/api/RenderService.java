package org.hisp.appstore.api;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
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

    void toXml ( OutputStream outputStream, Object value ) throws IOException;

    <T> T fromXml ( InputStream inputStream, Class<T> klass ) throws IOException;

    void renderOk (HttpServletResponse response, HttpServletRequest request, String message ) throws IOException;

    void renderCreated ( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException;

    void renderAccepted ( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException;

    void renderConflict ( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException;

    void renderNotFound ( HttpServletResponse response, HttpServletRequest request, String message ) throws IOException;
}
