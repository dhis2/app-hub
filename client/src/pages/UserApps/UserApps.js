import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Button,
    Input,
} from '@dhis2/ui'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppCard from './AppCard/AppCard'
import styles from './UserApps.module.css'
import config from 'config'
import * as api from 'src/api'
import { useQueryV1 } from 'src/api'
import {
    APP_STATUS_APPROVED,
    APP_STATUS_PENDING,
    APP_STATUS_REJECTED,
} from 'src/constants/apiConstants'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const { appStatusToDisplayName } = config.ui

const sortApps = apps =>
    apps.sort((a, b) => {
        if (a.name < b.name) {
            return -1
        } else if (a.name > b.name) {
            return 1
        }
        return 0
    })

const filterApps = (apps, query) => {
    if (!query) {
        return apps
    }
    return apps.filter(app =>
        [
            app.name,
            app.appType,
            app.developer.organisation || app.developer.name,
        ].some(prop => prop.toLowerCase().includes(query))
    )
}

const UserApps = ({ user }) => {
    const [query, setQuery] = useState('')
    const { data: appsById, error, mutate } = useQueryV1(
        user.manager ? 'apps/all' : 'apps/myapps',
        {
            auth: true,
        }
    )
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your apps" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!appsById) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    const apps = sortApps(Object.values(appsById))
    const filteredApps = filterApps(apps, query)
    const approvedApps = filteredApps.filter(
        app => app.status === APP_STATUS_APPROVED
    )
    const pendingApps = filteredApps
        .filter(app => app.status === APP_STATUS_PENDING)
        .sort((a, b) => {
            const aLatestVersion = Math.max(...a.versions.map(v => v.created))
            const bLatestVersion = Math.max(...b.versions.map(v => v.created))
            return bLatestVersion - aLatestVersion
        })
    const rejectedApps = filteredApps.filter(
        app => app.status === APP_STATUS_REJECTED
    )

    const setAppStatus = async (app, status) => {
        try {
            await api.setAppApproval(app.id, status)
            mutate(
                apps.map(a => {
                    if (a.id === app.id) {
                        return { ...a, status }
                    }
                    return a
                })
            )
            successAlert.show({
                message: `Status for ${app.name} was updated to ${appStatusToDisplayName[status]}`,
                // Handle notification of status change undoing
                actions:
                    app.status !== status
                        ? [
                              {
                                  label: 'Undo',
                                  onClick: () => setAppStatus(app, app.status),
                              },
                          ]
                        : null,
            })
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    const handleApprove = app => {
        setAppStatus(app, APP_STATUS_APPROVED)
    }
    const handleReject = app => {
        setAppStatus(app, APP_STATUS_REJECTED)
    }
    const handleDelete = async app => {
        if (!window.confirm(`Are you sure you want to delete ${app.name}?`)) {
            return
        }

        try {
            await api.deleteApp(app.id)
            mutate(apps.filter(a => a.id !== app.id))
            successAlert.show({
                message: `${app.name} has been deleted`,
            })
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to="/user/upload" tabIndex="-1">
                    <Button primary>Upload a new app</Button>
                </Link>
                <Input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search all your apps"
                    value={query}
                    onChange={({ value }) => setQuery(value)}
                />
            </div>
            {apps.length === 0 && (
                <section className={styles.statusCard}>
                    <h2 className={styles.statusCardHeader}>
                        You have no apps
                    </h2>

                    <Link to="/user/upload" tabIndex="-1">
                        <Button primary large>
                            Upload your first app
                        </Button>
                    </Link>
                </section>
            )}
            {apps.length > 0 && filteredApps.length === 0 && (
                <section className={styles.statusCard}>
                    <em>No apps match your search criteria.</em>
                </section>
            )}
            {rejectedApps.length > 0 && (
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
                        . Upload a new version to resubmit your app for
                        approval.
                    </p>

                    {rejectedApps.map(app => (
                        <AppCard
                            key={app.id}
                            app={app}
                            showUploadButton={!user.manager}
                            onApprove={
                                user.manager && (() => handleApprove(app))
                            }
                            onDelete={user.manager && (() => handleDelete(app))}
                        />
                    ))}
                </section>
            )}
            {pendingApps.length > 0 && (
                <section className={styles.statusCard}>
                    <h2 className={styles.statusCardHeader}>
                        Waiting for approval
                    </h2>
                    <p className={styles.statusCardDescription}>
                        All apps on the DHIS2 App Hub must be approved by the
                        core team. These apps have been submitted and are
                        waiting for approval.
                    </p>

                    {pendingApps.map(app => (
                        <AppCard
                            key={app.id}
                            app={app}
                            showUploadButton={!user.manager}
                            onApprove={
                                user.manager && (() => handleApprove(app))
                            }
                            onReject={user.manager && (() => handleReject(app))}
                            onDelete={user.manager && (() => handleDelete(app))}
                        />
                    ))}
                </section>
            )}
            {approvedApps.length > 0 && (
                <section className={styles.statusCard}>
                    <h2 className={styles.statusCardHeader}>
                        Available on App Hub
                    </h2>
                    <p className={styles.statusCardDescription}>
                        These apps are available for download from the DHIS2 App
                        Hub.
                    </p>

                    {approvedApps.map(app => (
                        <AppCard
                            key={app.id}
                            app={app}
                            showUploadButton={!user.manager}
                            onReject={user.manager && (() => handleReject(app))}
                            onDelete={user.manager && (() => handleDelete(app))}
                        />
                    ))}
                </section>
            )}
        </div>
    )
}

UserApps.propTypes = {
    user: PropTypes.object.isRequired,
}

export default UserApps
