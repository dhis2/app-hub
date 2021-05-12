import {
    NoticeBox,
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ReactFinalForm,
    InputFieldFF,
    hasValue,
    email,
    composeValidators,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './Modal.module.css'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const NewMemberModal = ({ organisation, mutate, onClose }) => {
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async ({ email }) => {
        try {
            await api.addOrganisationMember(organisation.id, email)
            mutate({
                ...organisation,
                users: [...organisation.users, { email }],
            })
            successAlert.show({
                message: `Successfully added ${email} to organisation`,
            })
            onClose()
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Modal onClose={onClose} small>
            <ModalTitle>Add member</ModalTitle>
            <ModalContent>
                <NoticeBox className={styles.noticebox}>
                    The user will receive an email with an invitation link. If
                    accepted, the user will be able to upload and manage apps on
                    behalf of this organisation.
                </NoticeBox>
                <ReactFinalForm.Form onSubmit={handleSubmit}>
                    {({ handleSubmit, valid, submitting }) => (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <ReactFinalForm.Field
                                required
                                name="email"
                                type="email"
                                label="Email of new member"
                                placeholder="user@email.com"
                                component={InputFieldFF}
                                className={styles.field}
                                validate={composeValidators(hasValue, email)}
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
                                    Add member
                                </Button>
                            </ButtonStrip>
                        </form>
                    )}
                </ReactFinalForm.Form>
            </ModalContent>
        </Modal>
    )
}

NewMemberModal.propTypes = {
    mutate: PropTypes.object.isRequired,
    organisation: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default NewMemberModal
