import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const DeleteScreenshotModal = ({ appId, imageId, mutate, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            await api.deleteImage(appId, imageId)
            mutate((app) => ({
                ...app,
                images: app.images.filter((img) => img.id !== imageId),
            }))
            successAlert.show({
                message: `Successfully deleted screenshot`,
            })
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsSubmitting(false)
    }

    return (
        <Modal onClose={onClose} small>
            <ModalTitle>Delete screenshot</ModalTitle>
            <ModalContent>
                Deleting a screenshot cannot be undone.
                <br />
                Are you sure you want to delete this screenshot?
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
                        {isSubmitting ? 'Deleting…' : 'Yes, delete'}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DeleteScreenshotModal.propTypes = {
    appId: PropTypes.string.isRequired,
    imageId: PropTypes.string.isRequired,
    mutate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default DeleteScreenshotModal
