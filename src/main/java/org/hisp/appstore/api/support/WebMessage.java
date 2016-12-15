package org.hisp.appstore.api.support;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.deser.std.NumberDeserializers;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import org.springframework.http.HttpStatus;

/**
 * Created by zubair on 14.12.16.
 */
@JacksonXmlRootElement( localName = "webMessage" )
public class WebMessage
{
    private String message;

    private HttpStatus httpStatus;

    public WebMessage()
    {
    }

    public WebMessage( String message, HttpStatus httpStatus )
    {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    @JsonProperty
    public String getMessage()
    {
        return message;
    }

    public void setMessage( String message )
    {
        this.message = message;
    }

    @JsonProperty
    public HttpStatus getHttpStatus()
    {
        return httpStatus;
    }

    public void setHttpStatus( HttpStatus httpStatus )
    {
        this.httpStatus = httpStatus;
    }

    @JsonProperty
    public Integer getHttpStatusCode ()
    {
        return this.httpStatus.value();
    }
}
