import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from '../../material/Grid/Grid'
import Col from '../../material/Grid/Col'
import FontIcon from 'material-ui/FontIcon'
import { Link, Route, Redirect, Switch } from 'react-router-dom'
import UserAppView from './userAppView/UserAppView'
import { List, ListItem } from 'material-ui/List'
import AppUploadStepper from './appUpload/AppUploadStepper'
import AppList from './appList/AppList'
import Divider from 'material-ui/Divider'
import { getUserInfo } from '../../selectors/userSelectors'
import { userLoad } from '../../actions/actionCreators'
import ErrorOrLoading from '../utils/ErrorOrLoading'
import ActiveLink from '../utils/ActiveLink'
import OrganisationList from './organisation/OrganisationList'
import OrganisationView from './organisation/OrganisationView'
import { ListItemLogoutButton } from '../auth/LogoutButton'

class UserView extends Component {
    componentDidMount() {
        this.props.loadUser()
    }

    render() {
        //  const {info, loading, loaded, error} = this.props.user;
        const userInfo = this.props.user
        const loadOrErr = userInfo.loading || userInfo.error
        const contentRoutes = (
            <Switch>
                <Route
                    exact
                    path={`${this.props.match.url}`}
                    component={AppList}
                />
                <Route
                    path={`${this.props.match.url}/organisations`}
                    component={OrganisationList}
                    exact={true}
                />
                <Route
                    path={`${this.props.match.url}/upload`}
                    component={AppUploadStepper}
                />
                <Route
                    path={`${this.props.match.url}/app/:appId`}
                    component={UserAppView}
                />
                <Route
                    path={`${this.props.match.url}/organisations/:slug`}
                    component={OrganisationView}
                />
                {/* No-match route - redirect to index */}
                <Route render={() => <Redirect to="/user" />} />
            </Switch>
        )

        return (
            <Grid align="center">
                <Col span={3} phone={4} tablet={8}>
                    <List style={{ padding: 0 }}>
                        <Link to="/">
                            <ListItem
                                primaryText="App Hub"
                                leftIcon={
                                    <FontIcon className="material-icons">
                                        home
                                    </FontIcon>
                                }
                            />
                        </Link>
                        <Divider
                            style={{ marginTop: '8px', marginBottom: '8px' }}
                        />
                        <ActiveLink
                            to={this.props.match.url}
                            activeOnlyWhenExact
                        >
                            <ListItem
                                primaryText="Apps"
                                leftIcon={
                                    <FontIcon className="material-icons">
                                        list
                                    </FontIcon>
                                }
                            />
                        </ActiveLink>
                        <ActiveLink
                            to={`${this.props.match.url}/organisations`}
                            activeOnlyWhenExact
                        >
                            <ListItem
                                primaryText="Organisations"
                                leftIcon={
                                    <FontIcon className="material-icons">
                                        people
                                    </FontIcon>
                                }
                            />
                        </ActiveLink>
                        <ActiveLink to={`${this.props.match.url}/upload`}>
                            <ListItem
                                primaryText="Upload"
                                leftIcon={
                                    <FontIcon className="material-icons">
                                        file_upload
                                    </FontIcon>
                                }
                            />
                        </ActiveLink>
                        <ListItemLogoutButton />
                    </List>
                </Col>
                <Col span={8} style={{ maxWidth: '900px' }}>
                    {loadOrErr ? (
                        <ErrorOrLoading
                            {...userInfo}
                            retry={this.props.loadUser}
                        />
                    ) : (
                        contentRoutes
                    )}
                </Col>
            </Grid>
        )
    }
}

UserView.PropTypes = {
    auth: PropTypes.object,
}

const mapStateToProps = state => ({
    user: getUserInfo(state),
})

const mapDispatchToProps = dispatch => ({
    loadUser() {
        dispatch(userLoad())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(UserView)
