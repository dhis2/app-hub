import React, { Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Spinner} from './../utils/Loader';
import { Route, Redirect } from 'react-router-dom';
import { userAuthenticated, userLogout } from '../../actions/actionCreators';
export class PrivateRoute extends Component {

    componentDidMount() {
        const {auth} = this.props;
        //If page is reloaded, we need to dispatch this, as the token is still valid
        //but redux-store is not updated for with this yet
        if (!this.props.authenticated && auth.isLoggedIn()) {
            this.props.authenticateUser();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.authenticated !== this.props.authenticated) || nextProps.location !== this.props.location;
    }

    render() {
        const {component, auth, ...rest} = this.props;

        return (<Route {...rest} render={props => {
            //If not logged in and the hash has not been parsed yet
            //we show a spinner to wait for the parsing
            if (!auth.isLoggedIn() && props.location.hash) {
                return <Spinner size="large"/>;
            }

            //User is logged in, show protected component!
            else if (auth.isLoggedIn()) {
                return React.createElement(component, {auth, ...props})
            } else { //logged out, be sure to dispatch logout-action and redirect to index
                this.props.logoutUser();
                return (<Redirect to="/" />)
            }
        }}/>)
    }

}

PrivateRoute.propTypes = {
    //Authservice instance to use for private route
    auth: PropTypes.object.isRequired,

    //Route forwards all Route props to component
}


const mapStateToProps = (state) => ({
    // mostly used for rerendering this component when
    // authservice has successfully authenticated to auth0
    authenticated: state.user.userInfo.authenticated
})

const mapDispatchToProps = (dispatch) => ({
    authenticateUser() {
        dispatch(userAuthenticated());
    },
    logoutUser() {
        dispatch(userLogout());
    }
})
//need pure-component else router-context won't be passed down to protected component
export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false})(PrivateRoute)
