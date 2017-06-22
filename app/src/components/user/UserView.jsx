import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Grid from '../../material/Grid/Grid';
import Col from '../../material/Grid/Col';
import FontIcon from 'material-ui/FontIcon';
import {Link, Route, Redirect, Switch} from 'react-router-dom';
import UserAppView from './userAppView/UserAppView';
import {List, ListItem} from 'material-ui/List';
import AppUpload from './appUpload/AppUpload';
import AppList from './appList/AppList';
import LoginView from './login/LoginView';
import {userLoad} from '../../actions/actionCreators';
import AuthService from '../../utils/AuthService';
import SubHeader from '../header/SubHeader';
import ErrorOrLoading from '../utils/ErrorOrLoading';
class UserView extends Component {

    componentDidMount() {
        this.props.loadUser();
    }

    render() {
      //  const {info, loading, loaded, error} = this.props.user;
        const { userInfo } = this.props.user;
        const loadOrErr = userInfo.loading || userInfo.error;
        const contentRoutes = (
            <Switch>
                <Route exact path={`${this.props.match.url}`} component={AppList}>
                </Route>
                <Route path={`${this.props.match.url}/upload`} component={AppUpload}/>
                <Route path={`${this.props.match.url}/app/:appId`} component={UserAppView}/>
                {/* No-match route - redirect to index */ }
                <Route render={props => (
                    <Redirect to="/user"/>)
                }/>
            </Switch>
        );

        return (
            <Grid>
                <Col span={2}>
                    <List style={{padding: 0}}>
                        <Link to={this.props.match.url}>
                            <ListItem primaryText="Apps"
                                      leftIcon={<FontIcon className="material-icons">list</FontIcon>}/>
                        </Link>
                        <Link to={`${this.props.match.url}/upload`}>
                            <ListItem primaryText="Upload"
                                      leftIcon={<FontIcon className="material-icons">file_upload</FontIcon>}/>
                        </Link>
                        <ListItem primaryText="Logout"
                                  leftIcon={<FontIcon className="material-icons">exit_to_app</FontIcon>}
                                  onClick={() => this.props.auth.logout()}/>
                    </List>
                </Col>
                <Col span={8} style={{maxWidth: '900px'}}>
                    {loadOrErr ? <ErrorOrLoading {...userInfo} retry={this.props.loadUser}/> : contentRoutes}
                </Col>
            </Grid>
        )
    }
}

UserView.PropTypes = {
    auth: PropTypes.object,
}

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
    loadUser() {
        dispatch(userLoad());
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
