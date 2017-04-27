import React, { Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Spinner} from './../utils/Loader';
import { Route } from 'react-router-dom';

export class PrivateRoute extends Component {
    componentWillMount() {
        const {auth} = this.props;
        //If page is reloaded, we need to dispatch this, as the token is still valid
        //but redux-store is not updated for with this yet
        if (!this.props.authenticated && auth.isLoggedIn()) {
            this.props.dispatch({type: "USER_AUTHENTICATED"});
        }
    }

    render() {
        const {component, auth, ...rest} = this.props;
        return (<Route {...rest} render={props => {
            //If not logged in and the hash has not been parsed yet
            //we show a spinner to wait for the parsing
            if (!auth.isLoggedIn() && !auth.isHashParsed()) {
                return <Spinner size="large"/>;
            }

            //User is logged in, show protected component!
            else if (auth.isLoggedIn()) {
                return React.createElement(component, {auth, ...props})
            } else {
                return (<Redirect to="/login"/>)
            }
        }}/>)
    }

}

PrivateRoute.propTypes = {
    //Authservice instace to use for private route
    auth: PropTypes.object.isRequired,

    //Route forwards all Route props to component
}


const mapStateToProps = (state) => ({
    // mostly used for rerendering this component when
    // authservice has successfully authenticated to auth0
    authenticated: state.user.userInfo.authenticated
})
//need pure-component else router-context won't be passed down to protected component
export default connect(mapStateToProps, null, null, { pure: false})(PrivateRoute)
