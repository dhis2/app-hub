package org.hisp.appstore.web.api;

import org.hisp.appstore.api.RenderService;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by zubair on 16.12.16.
 */
@ControllerAdvice
public class CrudControllerAdvice
{
    @Autowired
    private RenderService renderService;

    @ExceptionHandler ( WebMessageException.class )
    public void webMessageExceptionHandler( WebMessageException ex, HttpServletResponse response,
                                           HttpServletRequest request ) throws IOException
    {
        renderService.send( response, request, ex.getWebMessage() );
    }

    @ExceptionHandler( MultipartException.class )
    public void maxFileSizeExceptionHandler( MultipartException ex, HttpServletRequest request,
                                             HttpServletResponse response ) throws IOException
    {
        renderService.send( response, request, WebMessageUtils.conflict( ex.getCause().getMessage() ));
    }
}
