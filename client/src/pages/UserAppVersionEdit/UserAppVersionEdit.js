import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Card,
    Button,
    ReactFinalForm,
    InputFieldFF,
    SingleSelectFieldFF,
    composeValidators,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import semver from 'semver'
import styles from './UserAppVersionEdit.module.css'
import config from 'config'
import { useQueryV1 } from 'src/api'
import * as api from 'src/api'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'

const { dhisVersions } = config.ui

const semverValidator = value => {
    if (!semver.valid(value)) {
        return 'Please provide a valid semantic version'
    }
}

const maxDhisVersionValidator = (value, allValues) => {
    if (
        value &&
        dhisVersions.indexOf(value) >
            dhisVersions.indexOf(allValues['minDhisVersion'])
    ) {
        return 'Maximum DHIS version must be greater than minimum DHIS version'
    }
}

const dhisVersionOptions = dhisVersions.map(v => ({
    label: v,
    value: v,
}))

const channelOptions = Object.entries(config.ui.appChannelToDisplayName).map(
    ([value, label]) => ({
        value,
        label,
    })
)

const UserAppVersionEdit = ({ match }) => {
    const { appId, versionId } = match.params
    const { data: app, error } = useQueryV1(`apps/${appId}`, { auth: true })
    const version = app?.versions.find(v => v.id === versionId)
    const history = useHistory()
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handleSubmit = async values => {
        try {
            await api.updateVersion(app.id, version.id, values)
            successAlert.show({ message: 'App version updated successfully' })
            history.push(`/user/app/${app.id}`)
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading app" error>
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

    if (app && !version) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading app version" error>
                    App version not found
                </NoticeBox>
            </CenteredContent>
        )
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.header}>
                Edit app version v{version.version}
            </h2>

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
                            initialValue={version.version}
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
                            label="Minimum DHIS version"
                            initialValue={version.minDhisVersion}
                            component={SingleSelectFieldFF}
                            className={styles.field}
                            validate={hasValue}
                            options={dhisVersionOptions}
                        />
                        <ReactFinalForm.Field
                            name="maxDhisVersion"
                            label="Maximum DHIS version"
                            initialValue={version.maxDhisVersion}
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
                            initialValue={version.channel}
                            component={SingleSelectFieldFF}
                            className={styles.field}
                            validate={hasValue}
                            options={channelOptions}
                        />
                        <ReactFinalForm.Field
                            name="demoUrl"
                            label="Demo URL"
                            initialValue={version.demoUrl}
                            placeholder="e.g. https://dhis2.org/demo"
                            component={InputFieldFF}
                            className={styles.field}
                        />
                        <Button
                            primary
                            type="submit"
                            disabled={!valid || submitting}
                        >
                            Update app version
                        </Button>
                    </form>
                )}
            </ReactFinalForm.Form>
        </Card>
    )
}

UserAppVersionEdit.propTypes = {
    match: PropTypes.object.isRequired,
}

export default UserAppVersionEdit
