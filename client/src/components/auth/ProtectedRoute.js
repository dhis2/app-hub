import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Spinner from './Spinner'
import { Route, Redirect } from 'react-router-dom'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'

const ProtectedRoute = ({ component, ...rest }) => {
    return (
        <Route
            {...rest}
            component={withAuthenticationRequired(component, {
                onRedirecting: () => <Spinner size="large" />,
            })}
        />
    )
}

export default ProtectedRoute
