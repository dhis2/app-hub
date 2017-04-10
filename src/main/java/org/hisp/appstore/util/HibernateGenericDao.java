package org.hisp.appstore.util;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.hisp.appstore.api.GenericDao;
import org.hisp.appstore.api.domain.BaseIdentifiableObject;
import org.springframework.beans.factory.annotation.Required;

import java.util.List;

public abstract class HibernateGenericDao<T extends BaseIdentifiableObject>
    implements GenericDao<T>
{
    protected SessionFactory sessionFactory;

    @Required
    public void setSessionFactory ( SessionFactory sessionFactory )
    {
        this.sessionFactory = sessionFactory;
    }

    protected Class<T> clazz;

    @Required
    public void setClazz( Class<T> clazz )
    {
        this.clazz = clazz;
    }

    public Class<T> getClazz()
    {
        return clazz;
    }

    // -------------------------------------------------------------------------
    // Convenience methods
    // -------------------------------------------------------------------------

    /**
     * Creates a Query.
     *
     * @param hql the HQL query.
     * @return a Query instance.
     */
    protected final Query getQuery( String hql )
    {
        return sessionFactory.getCurrentSession().createQuery( hql );
    }

    /**
     * Creates a Criteria for the implementation Class type.
     *
     * @return a Criteria instance.
     */
    protected final Criteria getCriteria()
    {
        return sessionFactory.getCurrentSession().createCriteria( getClazz() );
    }

    /**
     * Creates a Criteria for the implementation Class type restricted by the
     * given Criteria.
     *
     * @param expressions the Criteria for the Criteria.
     * @return a Criteria instance.
     */
    protected final Criteria getCriteria( Criterion... expressions )
    {

        Criteria criteria = sessionFactory.getCurrentSession().createCriteria( getClazz() );

        for ( Criterion expression : expressions )
        {
            criteria.add( expression );
        }

        return criteria;
    }

    /**
     * Retrieves an object based on the given Criteria.
     *
     * @param expressions the Criteria for the Criteria.
     * @return an object of the implementation Class type.
     */
    @SuppressWarnings( "unchecked" )
    protected final T getObject( Criterion... expressions )
    {
        return (T) getCriteria( expressions ).uniqueResult();
    }

    /**
     * Retrieves a List based on the given Criteria.
     *
     * @param expressions the Criteria for the Criteria.
     * @return a List with objects of the implementation Class type.
     */
    @SuppressWarnings( "unchecked" )
    protected final List<T> getList( Criterion... expressions )
    {
        return getCriteria( expressions ).list();
    }

    // -------------------------------------------------------------------------
    // GenericDao implementation
    // -------------------------------------------------------------------------

    @Override
    public int save( T object )
    {
        if ( object != null )
        {
            object.setAutoFields();
        }

        T createdObject = preCreate( object );

        return (Integer) sessionFactory.getCurrentSession().save( createdObject );
    }

    @Override
    public void update( T object )
    {
        if ( object != null )
        {
            object.setAutoFields();
        }

        sessionFactory.getCurrentSession().update( object );
    }

    @Override
    public T preCreate( T object )
    {
        return object;
    }

    @Override
    public T get( int id )
    {
        return (T) sessionFactory.getCurrentSession().get( getClazz(), id );
    }

    public T get( String uid )
    {
        return getObject( Restrictions.eq( "uid", uid ) );
    }

    public T getByCode( String code )
    {
        return getObject( Restrictions.eq( "code", code ) );
    }

    @Override
    @SuppressWarnings( "unchecked" )
    public List<T> getAll()
    {
        return getCriteria().list();
    }

    @Override
    public void delete( T object )
    {
        sessionFactory.getCurrentSession().delete( object );
    }
}
