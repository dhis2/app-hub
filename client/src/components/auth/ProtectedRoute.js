import { withAuthenticationRequired } from '@auth0/auth0-react'
import { CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Route } from 'react-router-dom'
import AuthService from 'src/utils/AuthService'

/* eslint-disable react/display-name */

const ProtectedRoute = ({ component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                const ProtectedComponent = withAuthenticationRequired(
                    component,
                    {
                        onRedirecting: () => (
                            <CenteredContent>
                                <CircularLoader />
                            </CenteredContent>
                        ),
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
