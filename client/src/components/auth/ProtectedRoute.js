import PropTypes from 'prop-types'
import React from 'react'
import Spinner from '../utils/Spinner'
import { Route } from 'react-router-dom'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import AuthService from '../../utils/AuthService'

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

ProtectedRoute.propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    component: PropTypes.elementType,
}

export default ProtectedRoute
