package org.hisp.appstore.web.api;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hisp.appstore.api.BaseIdentifiableObjectManager;
import org.hisp.appstore.api.RenderService;
import org.hisp.appstore.api.domain.BaseIdentifiableObject;
import org.hisp.appstore.util.WebMessageException;
import org.hisp.appstore.util.WebMessageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

/**
 * Created by zubair on 13.12.16.
 */
public abstract class AbstractCrudController<T extends BaseIdentifiableObject>
{
    private static final Log log = LogFactory.getLog( AbstractCrudController.class );

    private static final String NO_ENTITY_FOUND = "No entity found with id: ";

    // -------------------------------------------------------------------------
    // Dependencies
    // -------------------------------------------------------------------------

    @Autowired
    private BaseIdentifiableObjectManager manager;

    @Autowired
    private RenderService renderService;

    private Class<T> entityClass;

    //--------------------------------------------------------------------------
    // GET
    //--------------------------------------------------------------------------

    @RequestMapping ( value = "/{uid}", method = RequestMethod.GET )
    public void getEntity( @PathVariable( "uid" ) String uid, HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException {
        BaseIdentifiableObject entity = manager.getByUid( getEntityClass(), uid );

        if ( entity == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NO_ENTITY_FOUND + uid ) );
        }

        renderService.toJson( response.getOutputStream(), entity );
    }

    //--------------------------------------------------------------------------
    // POST
    //--------------------------------------------------------------------------

    @RequestMapping ( method = RequestMethod.POST )
    public void saveEntity( HttpServletResponse response, HttpServletRequest request )
            throws IOException
    {
        BaseIdentifiableObject entity = renderService.fromJson( request.getInputStream(), getEntityClass() );

        manager.save( entity );

        renderService.renderCreated( response, request, "Entity saved" );
    }

    @RequestMapping ( method = RequestMethod.PUT )
    public void updateEntity( HttpServletResponse response, HttpServletRequest request )
            throws IOException
    {
        BaseIdentifiableObject entity = renderService.fromJson( request.getInputStream(), getEntityClass() );

        manager.update( entity );

        renderService.renderAccepted( response, request, "Entity updated" );
    }

    //--------------------------------------------------------------------------
    // DELETE
    //--------------------------------------------------------------------------

    @RequestMapping ( value = "/{uid}", method = RequestMethod.DELETE )
    public void deleteEntity( @PathVariable( "uid" ) String uid,
                              HttpServletResponse response, HttpServletRequest request )
            throws IOException, WebMessageException {
        BaseIdentifiableObject entity = manager.getByUid( getEntityClass(), uid );

        if ( entity == null )
        {
            throw new WebMessageException( WebMessageUtils.notFound( NO_ENTITY_FOUND + uid ) );
        }

        manager.delete( entity );

        renderService.renderAccepted( response, request, "Entity Deleted" );
    }

    // -------------------------------------------------------------------------
    // Supportive methods
    // -------------------------------------------------------------------------

    protected Class<T> getEntityClass()
    {
        if ( entityClass == null )
        {
            Type[] actualTypeArguments = ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments();
            entityClass = (Class<T>) actualTypeArguments[0];
        }

        return entityClass;
    }
}
