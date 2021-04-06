import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Card,
    Button,
    Divider,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './UserApp.module.css'
import config from 'config'
import * as api from 'src/api'
import { useQueryV1 } from 'src/api'
import AppDescription from 'src/components/AppDescription/AppDescription'
import AppIcon from 'src/components/AppIcon/AppIcon'
import Screenshots from 'src/components/Screenshots/Screenshots'
import Versions from 'src/components/Versions/Versions'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const { appTypeToDisplayName } = config.ui

const DetailsCard = ({ app }) => {
    const logo = app.images.find(img => img.logo)
    const appDeveloper = app.developer.organisation || app.developer.name
    const appType = appTypeToDisplayName[app.appType]

    const EditButton = ({ children }) => (
        <Link to={`/user/app/${app.id}/edit`} tabIndex="-1">
            <Button small>{children}</Button>
        </Link>
    )

    return (
        <Card className={styles.card}>
            <section className={styles.detailsCardHeader}>
                <div>
                    <AppIcon src={logo?.imageUrl} />
                    <EditButton>Edit logo</EditButton>
                </div>
                <div>
                    <div>
                        <h2 className={styles.detailsCardName}>{app.name}</h2>
                        <EditButton>Edit name</EditButton>
                    </div>
                    <span className={styles.detailsCardDeveloper}>
                        by {appDeveloper}
                    </span>
                    <div>
                        <span className={styles.detailsCardType}>
                            {appType}
                        </span>
                        <EditButton>Edit app type</EditButton>
                    </div>
                </div>
            </section>
            <Divider />
            <section>
                <h2 className={styles.cardHeader}>Description</h2>
                <div style={{ display: 'flex' }}>
                    <div style={{ maxWidth: 640, marginRight: 8 }}>
                        {app.description ? (
                            <AppDescription
                                description={app.description}
                                paragraphClassName={styles.descriptionParagraph}
                            />
                        ) : (
                            <em>No description provided</em>
                        )}
                    </div>
                    <EditButton>Edit description</EditButton>
                </div>
            </section>
            <Divider />
            <section>
                <h2 className={styles.cardHeader}>Source code URL</h2>
                <span style={{ marginRight: 8 }}>
                    {app.sourceUrl ? (
                        <a href="{app.sourceUrl}">{app.sourceUrl}</a>
                    ) : (
                        <em>No source code URL provided</em>
                    )}
                </span>
                <EditButton>Edit source code URL</EditButton>
            </section>
        </Card>
    )
}

const VersionsCard = ({ app }) => {
    const versions = app.versions.sort((a, b) => b.created - a.created)
    const renderEditVersionButton = version => (
        <Link
            className={styles.editVersionButton}
            to={`/user/app/${app.id}/version/${version.id}/edit`}
            tabIndex="-1"
        >
            <Button small secondary>
                Edit
            </Button>
        </Link>
    )

    return (
        <Card className={styles.card}>
            <h2 className={styles.cardHeader}>Versions</h2>
            <Versions
                versions={versions}
                renderEditVersionButton={renderEditVersionButton}
            />
        </Card>
    )
}

const ScreenshotsCard = ({ app, mutate }) => {
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()
    const screenshots = app.images.filter(img => !img.logo)
    const handleScreenshotDelete = async imageId => {
        if (
            !window.confirm('Are you sure you want to delete this screenshot?')
        ) {
            return
        }

        try {
            await api.deleteImage(app.id, imageId)
            mutate({
                ...app,
                images: app.images.filter(img => img.id != imageId),
            })
            successAlert.show({ message: 'Image deleted' })
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.cardHeader}>Screenshots</h2>
            {screenshots.length > 0 ? (
                <Screenshots
                    screenshots={screenshots}
                    onDelete={handleScreenshotDelete}
                />
            ) : (
                <em>This app has no screenshots</em>
            )}
            {/* TODO: Buttons to upload images */}
        </Card>
    )
}

const UserApp = ({ match }) => {
    const { appId } = match.params
    const { data: app, error, mutate } = useQueryV1(`apps/${appId}`, {
        auth: true,
    })

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your app" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!app) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <>
            <DetailsCard app={app} />
            <VersionsCard app={app} />
            <ScreenshotsCard app={app} mutate={mutate} />
        </>
    )
}

UserApp.propTypes = {
    match: PropTypes.object.isRequired,
}

export default UserApp
