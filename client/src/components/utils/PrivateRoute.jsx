import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { Route, Redirect } from 'react-router-dom'
import { userAuthenticated, userLogout } from '../../actions/actionCreators'
import { getUserInfo } from '../../selectors/userSelectors'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'

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

export class PrivateRoute extends Component {
    componentDidMount() {
        const { auth } = this.props
        //If page is reloaded, we need to dispatch this, as the token is still valid
        //but redux-store is not updated for with this yet
        if (!this.props.authenticated && auth.isLoggedIn()) {
            this.props.authenticateUser()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.authenticated !== this.props.authenticated ||
            nextProps.location !== this.props.location
        )
    }

    componentWillUnmount() {
        const { auth } = this.props
        // dispatch logout-action when user is redirected off of this route
        // and is not connected to auth.
        // this happens e.g. if token expires.
        if (!auth.isLoggedIn() && this.props.authenticated) {
            this.props.logoutUser()
        }
    }

    render() {
        const { component, auth, ...rest } = this.props

        return (
            <Route
                {...rest}
                render={props => {
                    //If not logged in and the hash has not been parsed yet
                    //we show a spinner to wait for the parsing
                    if (!auth.isLoggedIn() && props.location.hash) {
                        return <Spinner size="large" />
                    } else if (auth.isLoggedIn()) {
                        //User is logged in, show protected component!
                        return React.createElement(component, {
                            auth,
                            ...props,
                        })
                    } else {
                        //logged out, be sure to dispatch logout-action and redirect to index
                        return <Redirect to="/" />
                    }
                }}
            />
        )
    }
}

PrivateRoute.propTypes = {
    //Authservice instance to use for private route
    auth: PropTypes.object.isRequired,

    //Route forwards all Route props to component
}

const mapStateToProps = state => ({
    // mostly used for rerendering this component when
    // authservice has successfully authenticated to auth0
    authenticated: getUserInfo(state).authenticated,
})

const mapDispatchToProps = dispatch => ({
    authenticateUser() {
        dispatch(userAuthenticated())
    },
    logoutUser() {
        dispatch(userLogout())
    },
})
//need non-pure-component else router-context won't be passed down to protected component
const ConnectedPrivateRoute = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        pure: false,
    }
)(PrivateRoute)

export default ProtectedRoute
