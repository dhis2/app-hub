import { connect } from 'react-redux'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
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
import classnames from 'classnames'
import styles from './UserApps.module.css'

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

    // TODO: only render each section (rejected, pending, approved) if those apps are present
    // TODO: test with user.manager == false

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/user/upload">
                    <Button tabIndex="-1" primary>
                        Upload a new app
                    </Button>
                </Link>
                <Input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search all your apps"
                />
            </div>
            <section
                className={classnames(
                    styles.statusCard,
                    styles.rejectedStatusCard
                )}
            >
                <h2
                    className={classnames(
                        styles.statusCardHeader,
                        styles.rejectedStatusCardHeader
                    )}
                >
                    Rejected
                </h2>
                <p className={styles.statusCardDescription}>
                    Apps can be rejected if they don't meet the{' '}
                    <a
                        style={{ textDecoration: 'underline' }}
                        href="https://developers.dhis2.org/docs/guides/apphub-guidelines"
                    >
                        App Hub guidelines
                    </a>
                    . Upload a new version to resubmit your app for approval.
                </p>
            </section>
        </div>
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
