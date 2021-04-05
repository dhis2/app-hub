import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Card,
    Button,
} from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import styles from './UserAppView.module.css'
import * as api from 'src/api'
import { useQueryV1 } from 'src/api'
import Screenshots from 'src/components/Screenshots/Screenshots'
import Versions from 'src/components/Versions/Versions'
import { useAlert, useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const DetailsCard = ({ app }) => (
    <Card className={styles.card}>
        {/* TODO: Buttons to edit name, description and logo */}

        <h2 className={styles.cardHeader}>Description</h2>
        <div style={{ display: 'flex' }}>
            {app.description ? (
                <>
                    <div style={{ maxWidth: 640, marginRight: 8 }}>
                        <p style={{ margin: 0 }}>{app.description}</p>
                    </div>
                    <Button small>Edit description</Button>
                </>
            ) : (
                <Button primary>Add a description</Button>
            )}
        </div>
    </Card>
)

const VersionsCard = ({ app }) => {
    const versions = app.versions.sort((a, b) => b.created - a.created)

    return (
        <Card className={styles.card}>
            <h2 className={styles.cardHeader}>Versions</h2>
            <Versions versions={versions} />
        </Card>
    )
}

const ScreenshotsCard = ({ app, mutate }) => {
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()
    const screenshots = app.images.filter(img => !img.logo)
    const handleScreenshotDelete = async imageId => {
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
            {/* Buttons to upload images */}
        </Card>
    )
}

const UserAppView = ({ match, user }) => {
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

UserAppView.propTypes = {
    user: PropTypes.object.isRequired,
}

export default UserAppView
