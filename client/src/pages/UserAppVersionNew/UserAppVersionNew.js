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
    TextAreaFieldFF,
} from '@dhis2/ui'
import { useHistory } from 'react-router-dom'
import styles from './UserAppVersionNew.module.css'
import config from 'config'
import { useQueryV1, useQuery } from 'src/api'
import * as api from 'src/api'
import { maxDhisVersionValidator } from 'src/lib/form-validators/max-dhis-version-validator'
import { semverValidator } from 'src/lib/form-validators/semver-validator'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'
import DescriptionEditor from '../UserAppEdit/DescriptionEditor'

const { dhisVersions, defaultAppChannel, appChannelToDisplayName } = config.ui
const oldestSupportedDhisVersion = dhisVersions[2]

const dhisVersionOptions = dhisVersions.map((v) => ({
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
    const { appId, appVersion } = match.params
    const { data: appVersionData, error: errorAppVersion } = useQuery(
        appVersion ? `appVersions/${appVersion}` : null,
        null,
        { useAuth: true }
    )
    const { data: app, error } = useQueryV1(`apps/${appId}`, { auth: true })

    const editMode = appVersion && appVersionData

    const history = useHistory()
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async (values) => {
        try {
            let message = `Successfully created app version ${values.version}`
            if (editMode) {
                const {
                    demoUrl,
                    version,
                    minDhisVersion,
                    maxDhisVersion,
                    channel,
                } = appVersionData

                await api.updateVersion(appId, appVersionData.id, {
                    changeSummary: values.changeSummary,
                    demoUrl,
                    version,
                    minDhisVersion,
                    maxDhisVersion,
                    channel,
                })
                message = `Successfully edited app version ${values.version}`
            } else {
                await api.createNewVersion(appId, {
                    file: values.file[0],
                    version: values,
                })
            }
            successAlert.show({
                message,
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

    const title = editMode ? 'Edit app version' : 'Create app version'

    return (
        <Card className={styles.card}>
            <h2 className={styles.header}>
                {title}: {app.name}{' '}
                {appVersionData ? `(${appVersionData?.version})` : null}
            </h2>

            <ReactFinalForm.Form
                initialValues={appVersionData ?? {}}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, valid, submitting, values }) => (
                    <form onSubmit={handleSubmit}>
                        <ReactFinalForm.Field
                            required
                            name="version"
                            label="Version"
                            placeholder="e.g. 1.0.0"
                            disabled={editMode}
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
                            disabled={editMode}
                            name="minDhisVersion"
                            label="Minimum DHIS2 version"
                            initialValue={oldestSupportedDhisVersion}
                            placeholder="Select a version"
                            component={SingleSelectFieldFF}
                            className={styles.field}
                            validate={hasValue}
                            options={dhisVersionOptions}
                        />
                        <ReactFinalForm.Field
                            name="maxDhisVersion"
                            disabled={editMode}
                            label="Maximum DHIS2 version"
                            placeholder="Select a version"
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
                            disabled={editMode}
                            label="Release channel"
                            initialValue={defaultAppChannel}
                            component={SingleSelectFieldFF}
                            className={styles.field}
                            validate={hasValue}
                            options={channelOptions}
                        />
                        <ReactFinalForm.Field
                            name="demoUrl"
                            disabled={editMode}
                            label="Demo URL"
                            placeholder="e.g. https://dhis2.org/demo"
                            component={InputFieldFF}
                            className={styles.field}
                        />
                        <DescriptionEditor
                            required={false}
                            description={values.changeSummary}
                            label="Version changes summary"
                            name="changeSummary"
                            placeholder="What is new and special about this version"
                            helpText="This summary will appear before the version change log (if there is one)"
                        />
                        {!editMode && (
                            <ReactFinalForm.Field
                                required
                                disabled={editMode}
                                name="file"
                                label="Upload version"
                                accept=".zip"
                                validate={hasValue}
                                component={FileInputFieldFF}
                                className={styles.field}
                            />
                        )}
                        <Button
                            primary
                            type="submit"
                            disabled={!valid || submitting}
                        >
                            {editMode
                                ? 'Edit app version'
                                : 'Create app version'}
                        </Button>
                    </form>
                )}
            </ReactFinalForm.Form>
        </Card>
    )
}

export default UserAppVersionNew
