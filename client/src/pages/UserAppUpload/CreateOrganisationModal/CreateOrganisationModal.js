import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ReactFinalForm,
    InputFieldFF,
    composeValidators,
    hasValue,
    email,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './CreateOrganisationModal.module.css'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const CreateOrganisationModal = ({ mutate, onClose }) => {
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async ({ name, email }) => {
        try {
            const organisation = await api.addOrganisation({ name, email })
            mutate(organisations => [...organisations, organisation])
            successAlert.show({
                message: `Successfully created organisation ${name}`,
            })
            onClose()
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Modal onClose={onClose} small>
            <ModalTitle>Create organisation</ModalTitle>
            <ModalContent>
                <ReactFinalForm.Form onSubmit={handleSubmit}>
                    {({ handleSubmit, valid, submitting }) => (
                        <form onSubmit={handleSubmit}>
                            <ReactFinalForm.Field
                                required
                                name="name"
                                label="Organisation name"
                                placeholder="e.g. 'My Organisation'"
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
                                className={styles.field}
                                validate={composeValidators(hasValue, email)}
                            />
                            <Button
                                primary
                                type="submit"
                                disabled={!valid || submitting}
                            >
                                Create organisation
                            </Button>
                        </form>
                    )}
                </ReactFinalForm.Form>
            </ModalContent>
        </Modal>
    )
}

CreateOrganisationModal.propTypes = {
    mutate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default CreateOrganisationModal
