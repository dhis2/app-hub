import React, {Component} from 'react';
import {Router, Route, Redirect} from 'react-router-dom';
import {history} from '../utils/history';
import 'material-components-web/build/material-components-web.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../styles/theme';
import '../styles/override.css';
import AppCards from './appCards/AppCards';
import AppView from './appView/AppView';
import UserView from './user/UserView';
import Header from './header/Header';
import Snackbar from './utils/Snackbar';
import DialogRoot from './dialog/DialogRoot';
import ErrorDialog from './dialog/ErrorDialog';
import * as dialogType from '../constants/dialogTypes';
import {Provider, connect} from 'react-redux';
import store from '../store';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LoginView from './user/login/LoginView';
import {getAuth} from '../utils/AuthService';
import {Spinner} from './utils/Loader';
injectTapEventPlugin();

const auth = getAuth();

class Privateroute extends Component {
    componentWillMount() {
        const {auth} = this.props;
        //If page is reloaded, we need to dispatch this, as the token is still valid
        //but redux-store is not updated for this yet
        if (!this.props.authenticated && auth.isLoggedIn()) {
            this.props.dispatch({type: "USER_AUTHENTICATED"});
        }
    }

    render() {
        const {component, ...rest} = this.props;
        const { auth } = rest;
        return (<Route {...rest} render={props => {
            if (!auth.isLoggedIn() && !auth.isHashParsed()) {
                return <Spinner size="large"/>;
            }

            else if (auth.isLoggedIn()) {
                return React.createElement(component, {auth, ...props})
            } else {
                return (<Redirect to="/login"/>)
            }
        }}/>)
    }

}
const mapStateToProps = (state) => ({
    // mostly used for rerendering this component when
    // authservice has successfully authenticated to auth0
    authenticated: state.user.userInfo.authenticated
})
//need pure-comppnent else router-context won't be passed down
const PrivateRoutee = connect(mapStateToProps, null, null, { pure: false})(Privateroute)

export default function AppStore() {
    return (

        <Provider store={ store }>
            <MuiThemeProvider muiTheme={theme}>
                <Router history={history}>
                    <div className="app">
                        <Header />
                        <Route exact path="/" component={AppCards}/>
                        <Route path='/app/:appId' component={AppView}/>


                        <Route exact path="/login" render={(location, props) => (
                            <LoginView auth={auth} {...props} />)}/>
                        <PrivateRoutee path='/user' auth={auth} component={UserView}/>
                        <DialogRoot />

                        <Snackbar />
                    </div>
                </Router>
            </MuiThemeProvider>
        </Provider>

    );
}
