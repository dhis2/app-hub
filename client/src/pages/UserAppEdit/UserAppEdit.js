import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Card,
    Button,
    ReactFinalForm,
    InputFieldFF,
    SwitchFieldFF,
    url,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DescriptionEditor from './DescriptionEditor'
import styles from './UserAppEdit.module.css'
import { useQueryV1 } from 'src/api'
import * as api from 'src/api'
import { nameLengthValidator } from 'src/lib/form-validators'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'
import { isManager as isManagerSelector } from 'src/selectors/userSelectors'

const UserAppEdit = ({ match }) => {
    const { appId } = match.params
    const { data: app, error } = useQueryV1(`apps/${appId}`, { auth: true })
    const history = useHistory()
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()
    const isManager = useSelector(isManagerSelector)

    const handleSubmit = async (values) => {
        try {
            await api.updateApp(app.id, values)
            successAlert.show({ message: 'App updated successfully' })
            history.push(`/user/app/${app.id}`)
        } catch (error) {
            errorAlert.show({ error })
        }
    }

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
        <Card className={styles.card}>
            <header className={styles.header}>
                <h2 className={styles.headerText}>Edit app</h2>
                <a
                    className={styles.guidelinesLink}
                    href="https://developers.dhis2.org/docs/guides/apphub-guidelines"
                >
                    App Hub guidelines
                </a>
            </header>

            <ReactFinalForm.Form onSubmit={handleSubmit}>
                {({ handleSubmit, valid, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <ReactFinalForm.Field
                            required
                            name="name"
                            label="App name"
                            placeholder="e.g. 'Data Visualizer' or 'Interactive Scorecards'"
                            helpText="Try to capture the core functionality of the app in a few words."
                            initialValue={app.name}
                            component={InputFieldFF}
                            className={styles.field}
                            validate={nameLengthValidator}
                        />
                        <DescriptionEditor description={app.description} />
                        <ReactFinalForm.Field
                            name="sourceUrl"
                            label="Source code URL"
                            type="url"
                            placeholder="e.g. https://github.com/user/app"
                            helpText="Sharing the source code of your app lets technical users evaluate if the app is right for their instance."
                            initialValue={app.sourceUrl}
                            component={InputFieldFF}
                            className={styles.field}
                            validate={url}
                        />
                        {isManager && (
                            <ReactFinalForm.Field
                                name="coreApp"
                                label="Core App"
                                type="checkbox"
                                placeholder="e.g. https://github.com/user/app"
                                helpText="Set the app as an Core app, normally this is set from the manifest when uploading an app."
                                initialValue={app.coreApp}
                                component={SwitchFieldFF}
                                className={styles.field}
                            />
                        )}
                        <Button
                            primary
                            type="submit"
                            disabled={!valid || submitting}
                        >
                            Update app
                        </Button>
                    </form>
                )}
            </ReactFinalForm.Form>
        </Card>
    )
}

UserAppEdit.propTypes = {
    match: PropTypes.object.isRequired,
}

export default UserAppEdit
