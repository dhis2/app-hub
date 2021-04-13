import {
    Card,
    Button,
    NoticeBox,
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
            mutate(app => ({
                ...app,
                versions: app.versions.filter(v => v.id != version.id),
            }))
            successAlert.show({
                message: `Successfully delete version ${version.version}`,
            })
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsSubmitting(false)
    }

    return (
        <Modal onClose={onClose} small>
            <ModalTitle>Delete app version</ModalTitle>
            <ModalContent>
                <NoticeBox warning>
                    Are you sure you want to delete version {version.version}?
                    This action cannot be undone.
                </NoticeBox>
            </ModalContent>
            <ModalActions>
                <div className={styles.modalActions}>
                    <Button
                        destructive
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        Delete version
                    </Button>
                    <Button secondary onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                </div>
            </ModalActions>
        </Modal>
    )
}

const DeleteVersionButton = ({ version, mutate }) => {
    const deleteVersionModal = useModalState()

    return (
        <>
            {deleteVersionModal.isVisible && (
                <DeleteVersionModal
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
    const renderDeleteVersionButton = version => (
        <DeleteVersionButton appId={app.id} version={version} mutate={mutate} />
    )

    return (
        <Card className={sharedStyles.card}>
            <h2 className={sharedStyles.cardHeader}>Versions</h2>
            <Versions
                versions={versions}
                renderEditVersionButton={renderEditVersionButton}
                renderDeleteVersionButton={renderDeleteVersionButton}
            />
            <Link
                className={styles.newVersionButton}
                to={`/user/app/${app.id}/version/new`}
                tabIndex="-1"
            >
                <Button primary>New version</Button>
            </Link>
        </Card>
    )
}

VersionsCard.propTypes = {
    app: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired,
}

export default VersionsCard
