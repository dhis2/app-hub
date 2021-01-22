import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import config from '../../../config'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { Auth, apiV2 } from '../../api/api'
import { userLoaded } from '../../actions/actionCreators'

const AuthProvider = ({ children }) => (
    <Auth0Provider
        domain={config.auth0.domain}
        clientId={config.auth0.clientID}
        audience={config.auth0.audience}
        redirectUri={`${window.location.protocol}//${window.location.host}`}
        useRefreshTokens={true}
        advancedOptions={{
            defaultScope:
                'openid apps.dhis2.org/roles email profile read:organisations update:organisations',
        }}
    >
        <InitializeAuth>{children}</InitializeAuth>
    </Auth0Provider>
)

const InitializeAuth = ({ children }) => {
    const auth0API = useAuth0()
    const dispatch = useDispatch()

    useEffect(() => {
        const { user, isAuthenticated, isLoading } = auth0API
        //AuthService.setAuth0API(auth0API)
        apiV2.setAccessTokenFunc(auth0API.getAccessTokenSilently)

        if (!isLoading && isAuthenticated && user) {
            const userProfile = {
                ...user,
                roles: user['https://apps.dhis2.org/roles'],
            }

            localStorage.setItem('profile', JSON.stringify(userProfile))

            dispatch(userLoaded(userProfile))
        }

        if (!isLoading && !isAuthenticated && localStorage.getItem('profile')) {
            console.log('removez')
            localStorage.removeItem('profile')
            dispatch({ type: 'USER_LOGOUT' })
        }
    }, [auth0API])

    // const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch({ type: 'USER_SET_AUTH', payload: getAccessTokenSilently })
    // }, [getAccessTokenSilently, dispatch])

    return children
}

AuthProvider.propTypes = {
    children: PropTypes.node,
}

export default AuthProvider
