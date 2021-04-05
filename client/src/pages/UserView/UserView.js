import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { loadUser } from 'src/actions/actionCreators'
import UserApps from 'src/pages/UserApps/UserApps'
import UserAppView from 'src/pages/UserAppView/UserAppView'
import { getUserInfo } from 'src/selectors/userSelectors'

const PageNotFound = () => (
    <CenteredContent>
        <NoticeBox title="Page not found" error></NoticeBox>
    </CenteredContent>
)

const UserView = ({ loadUser, user, match }) => {
    useEffect(() => {
        loadUser()
    }, [])

    if (user.error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your profile" error>
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

    // eslint-disable-next-line react/display-name
    const provideUser = Component => props => (
        <Component {...props} user={user.profile} />
    )

    return (
        <Switch>
            <Route exact path={match.url} component={provideUser(UserApps)} />
            <Route
                path={`${match.url}/app/:appId`}
                component={provideUser(UserAppView)}
            />
            {/*
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
            {/* No-match route */}
            <Route render={PageNotFound} />
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

const mapDispatchToProps = {
    loadUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView)
