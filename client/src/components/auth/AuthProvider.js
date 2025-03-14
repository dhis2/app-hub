import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import config from 'config'
import { userLoaded } from 'src/actions/actionCreators'
import { Auth, getUser } from 'src/api'

const AuthProvider = ({ children }) => (
    <Auth0Provider
        domain={config.auth0.domain}
        clientId={config.auth0.clientID}
        audience={config.auth0.audience}
        redirectUri={`${window.location.protocol}//${window.location.host}/user`}
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
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
        useAuth0()
    const dispatch = useDispatch()

    useEffect(() => {
        Auth.setAccessTokenFunc(getAccessTokenSilently)
    }, [getAccessTokenSilently])

    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getUser()
            const userProfile = {
                ...user,
                ...userInfo,
                roles: user['https://apps.dhis2.org/roles'],
            }

            Auth.setProfile(userProfile)
            dispatch(userLoaded(userProfile))
        }
        if (!isLoading && isAuthenticated && user) {
            getUserInfo()
        }

        if (!isLoading && !isAuthenticated && localStorage.getItem('profile')) {
            Auth.logout()
            dispatch({ type: 'USER_LOGOUT' })
        }
    }, [user, isAuthenticated, isLoading, dispatch])

    return children
}

AuthProvider.propTypes = {
    children: PropTypes.node,
}

export default AuthProvider
