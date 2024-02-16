import {
    Card,
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import sharedStyles from '../UserApp.module.css'
import styles from './VersionsCard.module.css'
import * as api from 'src/api'
import Versions from 'src/components/Versions/Versions'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'
import { useModalState } from 'src/lib/use-modal-state'

const DeleteVersionModal = ({ appId, version, mutate, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            await api.deleteVersion(appId, version.id)
            mutate((app) => ({
                ...app,
                versions: app.versions.filter((v) => v.id != version.id),
            }))
            successAlert.show({
                message: `Successfully deleted version ${version.version}`,
            })
            onClose()
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsSubmitting(false)
    }

    return (
        <Modal onClose={onClose} small>
            <ModalTitle>Delete app version</ModalTitle>
            <ModalContent>
                Deleting an app version cannot be undone.
                <br />
                Are you sure you want to delete app version {version.version}?
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        No, cancel
                    </Button>
                    <Button
                        destructive
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        Yes, delete
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

const DeleteVersionButton = ({ appId, version, mutate }) => {
    const deleteVersionModal = useModalState()

    return (
        <>
            {deleteVersionModal.isVisible && (
                <DeleteVersionModal
                    appId={appId}
                    version={version}
                    mutate={mutate}
                    onClose={deleteVersionModal.hide}
                />
            )}
            <Button
                small
                destructive
                className={styles.deleteVersionButton}
                onClick={deleteVersionModal.show}
            >
                Delete
            </Button>
        </>
    )
}

const VersionsCard = ({ app, mutate }) => {
    const versions = app.versions.sort((a, b) => b.created - a.created)
    const renderDeleteVersionButton = (version) => (
        <DeleteVersionButton appId={app.id} version={version} mutate={mutate} />
    )

    return (
        <Card className={sharedStyles.card}>
            <h2 className={sharedStyles.cardHeader}>Versions</h2>
            <Versions
                appId={app.id}
                versions={versions}
                renderDeleteVersionButton={renderDeleteVersionButton}
                showDownloadCount={true}
            />
            <Link
                className={styles.newVersionButton}
                to={`/user/app/${app.id}/version/new`}
                tabIndex="-1"
            >
                <Button>New version</Button>
            </Link>
        </Card>
    )
}

VersionsCard.propTypes = {
    app: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
}

export default VersionsCard
