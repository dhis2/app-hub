import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Card,
    Button,
    Divider,
} from '@dhis2/ui-core'
import PropTypes from 'prop-types'
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

    return (
        <Card className={styles.card}>
            <section className={styles.detailsCardHeader}>
                <div>
                    <AppIcon src={logo?.imageUrl} />
                    <Button small>Edit logo</Button>
                </div>
                <div>
                    <div>
                        <h2 className={styles.detailsCardName}>{app.name}</h2>
                        <Button small>Edit name</Button>
                    </div>
                    <div>
                        <span className={styles.detailsCardDeveloper}>
                            by {appDeveloper}
                        </span>
                        <Button small>Edit developer</Button>
                    </div>
                    <div>
                        <span className={styles.detailsCardType}>
                            {appType}
                        </span>
                        <Button small>Edit app type</Button>
                    </div>
                </div>
            </section>
            <Divider />
            <section>
                <h2 className={styles.cardHeader}>Description</h2>
                <div style={{ display: 'flex' }}>
                    {app.description ? (
                        <>
                            <div style={{ maxWidth: 640, marginRight: 8 }}>
                                <AppDescription
                                    description={app.description}
                                    paragraphClassName={
                                        styles.descriptionParagraph
                                    }
                                />
                            </div>
                            <Button small>Edit description</Button>
                        </>
                    ) : (
                        <Button primary>Add a description</Button>
                    )}
                </div>
            </section>
        </Card>
    )
}

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
            {/* Buttons to upload images */}
        </Card>
    )
}

const UserApp = ({ match, user }) => {
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
    user: PropTypes.object.isRequired,
}

export default UserApp
