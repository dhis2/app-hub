import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { loadUser } from 'src/actions/actionCreators'
import UserApiKey from 'src/pages/UserApiKey/UserApiKey'
import UserApp from 'src/pages/UserApp/UserApp'
import UserAppEdit from 'src/pages/UserAppEdit/UserAppEdit'
import UserApps from 'src/pages/UserApps/UserApps'
import UserAppVersionEdit from 'src/pages/UserAppVersionEdit/UserAppVersionEdit'
import UserOrganisation from 'src/pages/UserOrganisation/UserOrganisation'
import UserOrganisationNew from 'src/pages/UserOrganisationNew/UserOrganisationNew'
import UserOrganisations from 'src/pages/UserOrganisations/UserOrganisations'
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
                <NoticeBox title="Error loading your profile" error />
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
        <Component
            {...props}
            user={{
                isManager: user.profile.manager,
                id: user.userId,
            }}
        />
    )

    return (
        <Switch>
            <Route exact path={match.url} component={provideUser(UserApps)} />
            <Route exact path={`${match.url}/app/:appId`} component={UserApp} />
            <Route
                exact
                path={`${match.url}/app/:appId/edit`}
                component={UserAppEdit}
            />
            <Route
                exact
                path={`${match.url}/app/:appId/version/:versionId/edit`}
                component={UserAppVersionEdit}
            />
            <Route exact path={`${match.url}/apikey`} component={UserApiKey} />
            <Route
                exact
                path={`${match.url}/organisations`}
                component={provideUser(UserOrganisations)}
            />
            <Route
                exact
                path={`${match.url}/organisation/:organisationId`}
                component={provideUser(UserOrganisation)}
            />
            <Route
                path={`${match.url}/organisations/new`}
                component={UserOrganisationNew}
            />
            {/*
            <Route
                exact
                path={`${match.url}/app/:appId/version/upload`}
                component={UserAppVersionUpload}
            />
            <Route
                path={`${match.url}/upload`}
                component={AppUpload}
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
