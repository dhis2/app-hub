import { Card, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import sharedStyles from '../UserApp.module.css'
import DeleteScreenshotModal from './DeleteScreenshotModal'
import styles from './ScreenshotsCard.module.css'
import UploadScreenshot from './UploadScreenshot'
import Screenshots from 'src/components/Screenshots/Screenshots'
import { useModalState } from 'src/lib/use-modal-state'

const DeleteScreenshotButton = ({ appId, imageId, mutate }) => {
    const deleteScreenshotModal = useModalState()

    return (
        <>
            {deleteScreenshotModal.isVisible && (
                <DeleteScreenshotModal
                    appId={appId}
                    imageId={imageId}
                    mutate={mutate}
                    onClose={deleteScreenshotModal.hide}
                />
            )}
            <Button
                small
                destructive
                className={styles.deleteButton}
                onClick={deleteScreenshotModal.show}
            >
                Delete screenshot
            </Button>
        </>
    )
}

const ScreenshotsCard = ({ app, mutate }) => {
    const screenshots = app.images.filter(img => !img.logo)
    const renderDeleteScreenshotButton = imageId => (
        <DeleteScreenshotButton
            appId={app.id}
            imageId={imageId}
            mutate={mutate}
        />
    )

    return (
        <Card className={sharedStyles.card}>
            <h2 className={sharedStyles.cardHeader}>Screenshots</h2>
            {screenshots.length > 0 ? (
                <Screenshots
                    screenshots={screenshots}
                    renderDeleteScreenshotButton={renderDeleteScreenshotButton}
                />
            ) : (
                <>
                    <h3 className={styles.addScreenshotHeader}>
                        Add app screenshots
                    </h3>
                    <p className={styles.addScreenshotDescription}>
                        Screenshots help users learn more about your app. Learn
                        more about the{' '}
                        <a
                            href="https://developers.dhis2.org/docs/guides/apphub-guidelines/#screenshots"
                            className={styles.screenshotsGuidelinesLink}
                        >
                            guidelines for App Hub screenshots
                        </a>
                        .
                    </p>
                </>
            )}
            <UploadScreenshot appId={app.id} mutate={mutate} />
        </Card>
    )
}

ScreenshotsCard.propTypes = {
    app: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
}

export default ScreenshotsCard
