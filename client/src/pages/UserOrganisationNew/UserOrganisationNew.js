import {
    Card,
    Button,
    ReactFinalForm,
    InputFieldFF,
    composeValidators,
    hasValue,
    email,
} from '@dhis2/ui'
import { useHistory } from 'react-router-dom'
import { useQueryParam, StringParam } from 'use-query-params'
import styles from './UserOrganisationNew.module.css'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const UserOrganisationNew = () => {
    const [redirect] = useQueryParam('redirect', StringParam)
    const history = useHistory()
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async ({ name, email }) => {
        try {
            const { id } = await api.addOrganisation({ name, email })
            successAlert.show({
                message: `Successfully created organisation ${name}`,
            })
            if (redirect === 'userAppUpload') {
                history.push(`/user/upload`)
            } else {
                history.push(`/user/organisation/${id}`)
            }
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.header}>Create organisation</h2>

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
        </Card>
    )
}

export default UserOrganisationNew
