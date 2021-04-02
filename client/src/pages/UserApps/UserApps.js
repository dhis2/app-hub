import { connect } from 'react-redux'
import { useEffect } from 'react'
import {
    APP_STATUS_APPROVED,
    APP_STATUS_PENDING,
    APP_STATUS_REJECTED,
} from 'src/constants/apiConstants'
import * as selectors from 'src/selectors/userSelectors'
import {
    loadAllApps,
    loadUserApps,
    setAppApproval,
} from 'src/actions/actionCreators'
import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Button,
    Input,
} from '@dhis2/ui-core'

const UserApps = ({
    user,
    apps,
    loadAllApps,
    loadUserApps,
    setAppApproval,
}) => {
    useEffect(() => {
        if (user.manager) {
            loadAllApps()
        } else {
            loadUserApps()
        }
    }, [])

    if (apps.error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your apps" error>
                    {apps.error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (apps.loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    // if (apps.length === 0) {
    // return <em>You have no apps</em>
    // }

    return (
        <>
            <div>
                <Button primary>Upload a new app</Button>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    user: selectors.getUserProfile(state),
    apps: selectors.getUserAppList(state),
})

const mapDispatchToProps = {
    loadAllApps,
    loadUserApps,
    setAppApproval,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserApps)
