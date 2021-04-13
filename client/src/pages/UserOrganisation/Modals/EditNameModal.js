import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ReactFinalForm,
    InputFieldFF,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './Modal.module.css'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const EditNameModal = ({ organisation, mutate, onClose }) => {
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async ({ name }) => {
        try {
            await api.editOrganisation(organisation.id, { name })
            mutate({
                ...organisation,
                name,
            })
            successAlert.show({
                message: `Successfully updated organisation name to ${name}`,
            })
            onClose()
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Modal onClose={onClose} small>
            <ModalTitle>Edit organisation name</ModalTitle>
            <ModalContent>
                <ReactFinalForm.Form onSubmit={handleSubmit}>
                    {({ handleSubmit, valid, submitting }) => (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <ReactFinalForm.Field
                                required
                                name="name"
                                label="New organisation name"
                                placeholder="My organisation"
                                initialValue={organisation.name}
                                component={InputFieldFF}
                                validate={hasValue}
                            />
                            <div className={styles.actions}>
                                <Button
                                    type="submit"
                                    primary
                                    disabled={!valid || submitting}
                                >
                                    Update name
                                </Button>
                                <Button
                                    onClick={onClose}
                                    secondary
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )}
                </ReactFinalForm.Form>
            </ModalContent>
        </Modal>
    )
}

EditNameModal.propTypes = {
    mutate: PropTypes.object.isRequired,
    organisation: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default EditNameModal
