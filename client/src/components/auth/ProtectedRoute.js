import PropTypes from 'prop-types'
import React from 'react'
import Spinner from '../utils/Spinner'
import { Route } from 'react-router-dom'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const ProtectedRoute = ({ component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                const ProtectedComponent = withAuthenticationRequired(
                    component,
                    {
                        onRedirecting: () => <Spinner size="large" />,
                    }
                )

                return <ProtectedComponent auth={auth} {...props} />
            }}
        />
    )
}

export default ProtectedRoute
