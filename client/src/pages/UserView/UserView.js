import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui-core'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUserInfo } from 'src/selectors/userSelectors'
import { userLoad } from 'src/actions/actionCreators'
import UserApps from '../UserApps/UserApps'

const UserView = ({ loadUser, user, match }) => {
    useEffect(() => {
        loadUser()
    }, [])

    if (user.error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your profile">
                    {user.error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (user.loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <Switch>
            <Route exact path={match.url} component={UserApps} />
            {/*
            <Route
                path={`${match.url}/app/:appId`}
                component={UserAppView}
            />
            <Route
                path={`${match.url}/upload`}
                component={AppUpload}
            />
            <Route
                exact
                path={`${match.url}/organisations`}
                component={UserOrganisations}
            />
            <Route
                path={`${match.url}/organisations/:slug`}
                component={UserOrganisationView}
            />
            */}
            {/* No-match route - redirect to index */}
            <Route render={() => <Redirect to="/user" />} />
        </Switch>
    )
}

UserView.propTypes = {
    loadUser: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
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
