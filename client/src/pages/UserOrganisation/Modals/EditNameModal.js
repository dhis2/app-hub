import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ReactFinalForm,
    InputFieldFF,
    TextAreaFieldFF,
    hasValue,
    composeValidators,
    email,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './Modal.module.css'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const EditNameModal = ({ organisation, mutate, onClose }) => {
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async ({ name, email, description }) => {
        try {
            await api.editOrganisation(organisation.id, {
                name,
                email,
                description,
            })
            mutate({
                ...organisation,
                name,
                email,
                description,
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
                                className={styles.field}
                                validate={hasValue}
                            />
                            <ReactFinalForm.Field
                                required
                                name="email"
                                label="Contact email"
                                placeholder="Enter an email address"
                                type="email"
                                component={InputFieldFF}
                                initialValue={organisation.email}
                                className={styles.field}
                                validate={composeValidators(hasValue, email)}
                            />
                            <ReactFinalForm.Field
                                required
                                name="description"
                                label="Organisation description"
                                placeholder="Enter a description"
                                component={TextAreaFieldFF}
                                initialValue={organisation.description}
                                className={styles.field}
                            />
                            <ButtonStrip end>
                                <Button onClick={onClose} disabled={submitting}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    primary
                                    disabled={!valid || submitting}
                                >
                                    Update
                                </Button>
                            </ButtonStrip>
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
