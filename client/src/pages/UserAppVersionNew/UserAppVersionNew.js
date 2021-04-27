import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Card,
    Button,
    ReactFinalForm,
    InputFieldFF,
    SingleSelectFieldFF,
    FileInputFieldFF,
    composeValidators,
    hasValue,
} from '@dhis2/ui'
import { useHistory } from 'react-router-dom'
import styles from './UserAppVersionNew.module.css'
import config from 'config'
import { useQueryV1 } from 'src/api'
import * as api from 'src/api'
import { maxDhisVersionValidator } from 'src/lib/form-validators/max-dhis-version-validator'
import { semverValidator } from 'src/lib/form-validators/semver-validator'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const { dhisVersions, defaultAppChannel, appChannelToDisplayName } = config.ui

const dhisVersionOptions = dhisVersions.map(v => ({
    label: v,
    value: v,
}))

const channelOptions = Object.entries(appChannelToDisplayName).map(
    ([value, label]) => ({
        value,
        label,
    })
)

const UserAppVersionNew = ({ match }) => {
    const { appId } = match.params
    const { data: app, error } = useQueryV1(`apps/${appId}`, { auth: true })
    const history = useHistory()
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async values => {
        try {
            await api.createNewVersion(appId, {
                file: values.file[0],
                version: values,
            })
            successAlert.show({
                message: `Successfully created app version ${values.version}`,
            })
            history.push(`/user/app/${appId}`)
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
            <h2 className={styles.header}>Create app version: {app.name}</h2>

            <ReactFinalForm.Form onSubmit={handleSubmit}>
                {({ handleSubmit, valid, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <ReactFinalForm.Field
                            required
                            name="version"
                            label="Version"
                            helpText={
                                <>
                                    App versions must follow semantic
                                    versioning.{' '}
                                    <a
                                        className={styles.helpTextLink}
                                        href="https://docs.npmjs.com/about-semantic-versioning"
                                    >
                                        Read more about semantic versioning.
                                    </a>
                                </>
                            }
                            component={InputFieldFF}
                            className={styles.field}
                            validate={composeValidators(
                                hasValue,
                                semverValidator
                            )}
                        />
                        <ReactFinalForm.Field
                            required
                            name="minDhisVersion"
                            label="Minimum DHIS2 version"
                            component={SingleSelectFieldFF}
                            className={styles.field}
                            validate={hasValue}
                            options={dhisVersionOptions}
                        />
                        <ReactFinalForm.Field
                            name="maxDhisVersion"
                            label="Maximum DHIS2 version"
                            component={SingleSelectFieldFF}
                            className={styles.field}
                            validate={maxDhisVersionValidator}
                            options={[
                                { label: 'None', value: null },
                                ...dhisVersionOptions,
                            ]}
                        />
                        <ReactFinalForm.Field
                            required
                            name="channel"
                            label="Release channel"
                            initialValue={defaultAppChannel}
                            component={SingleSelectFieldFF}
                            className={styles.field}
                            validate={hasValue}
                            options={channelOptions}
                        />
                        <ReactFinalForm.Field
                            name="demoUrl"
                            label="Demo URL"
                            placeholder="e.g. https://dhis2.org/demo"
                            component={InputFieldFF}
                            className={styles.field}
                        />
                        <ReactFinalForm.Field
                            required
                            name="file"
                            label="Upload version"
                            accept=".zip"
                            validate={hasValue}
                            component={FileInputFieldFF}
                            className={styles.field}
                        />
                        <Button
                            primary
                            type="submit"
                            disabled={!valid || submitting}
                        >
                            Create app version
                        </Button>
                    </form>
                )}
            </ReactFinalForm.Form>
        </Card>
    )
}

export default UserAppVersionNew
