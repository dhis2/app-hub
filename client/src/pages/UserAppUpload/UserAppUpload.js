import {
    CenteredContent,
    CircularLoader,
    Card,
    Button,
    NoticeBox,
    ReactFinalForm,
    InputFieldFF,
    TextAreaFieldFF,
    SingleSelectFieldFF,
    FileInputFieldFF,
    composeValidators,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styles from './UserAppUpload.module.css'
import config from 'config'
import { useQuery } from 'src/api'
import * as api from 'src/api'
import { maxDhisVersionValidator } from 'src/lib/form-validators/max-dhis-version-validator'
import { semverValidator } from 'src/lib/form-validators/semver-validator'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'
import { useModalState } from 'src/lib/use-modal-state'
import CreateOrganisationModal from './CreateOrganisationModal/CreateOrganisationModal'

const {
    defaultAppType,
    appTypeToDisplayName,
    defaultAppChannel,
    appChannelToDisplayName,
    dhisVersions,
} = config.ui

const dhisVersionOptions = dhisVersions.map(v => ({
    label: v,
    value: v,
}))

const appTypeOptions = Object.entries(appTypeToDisplayName).map(
    ([value, label]) => ({
        value,
        label,
    })
)

const channelOptions = Object.entries(appChannelToDisplayName).map(
    ([value, label]) => ({
        value,
        label,
    })
)

const requestOpts = {
    useAuth: true,
}

const UserAppUpload = ({ user }) => {
    const { data: organisations, error, mutate } = useQuery(
        'organisations',
        useMemo(
            () => ({
                user: user.isManager ? null : user.id,
            }),
            [user.isManager, user.id]
        ),
        requestOpts
    )
    const createOrganisationModal = useModalState()
    const history = useHistory()
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your organisations" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!organisations) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (organisations.length === 0) {
        return (
            <Card className={styles.smallCard}>
                <NoticeBox title="You have no organisations to associate this app with">
                    <p>
                        Before uploading an app, you must first create an
                        organisation to associate it with.
                    </p>
                    <Link
                        to="/user/organisations/new"
                        className={styles.createOrganisationLink}
                        tabIndex="-1"
                    >
                        <Button primary>Create organisation</Button>
                    </Link>
                </NoticeBox>
            </Card>
        )
    }

    const organisationOptions = organisations.map(organisation => ({
        label: organisation.name,
        value: organisation.id,
    }))
    const handleSubmit = async ({
        name,
        description,
        appType,
        sourceUrl,
        file,
        logo,
        developerName,
        developerEmail,
        developerOrganisation,
        version,
        minDhisVersion,
        maxDhisVersion,
        demoUrl,
        channel,
    }) => {
        try {
            const { id: appId } = await api.createApp({
                file: file[0],
                logo: logo[0],
                app: {
                    name,
                    description,
                    appType,
                    sourceUrl,
                    developer: {
                        name: developerName,
                        email: developerEmail,
                        organisationId: developerOrganisation,
                    },
                    version: {
                        version,
                        minDhisVersion,
                        maxDhisVersion,
                        demoUrl,
                        channel,
                    },
                },
            })
            successAlert.show({ message: `Successfully uploaded app ${name}` })
            history.push(`/user/app/${appId}`)
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.header}>Create a new app</h2>
            <p className={styles.description}>
                A good app name, description and images are important. Make sure
                to describe clearly what your app does and provide helpful
                information for potential users. All submitted apps must be
                approved by the core DHIS2 team.
            </p>

            <ReactFinalForm.Form onSubmit={handleSubmit}>
                {({ handleSubmit, valid, submitting }) => (
                    <form onSubmit={handleSubmit}>
                        <section className={styles.formSection}>
                            <h3 className={styles.subheader}>
                                Basic information
                            </h3>
                            <p className={styles.description}>
                                This information will be shown to all potential
                                users on the DHIS2 App Hub.
                            </p>
                            <ReactFinalForm.Field
                                required
                                name="name"
                                label="Name"
                                placeholder="e.g. 'Data Visualizer' or 'Interactive Scorecards'"
                                component={InputFieldFF}
                                className={styles.field}
                                validate={hasValue}
                            />
                            <ReactFinalForm.Field
                                required
                                name="description"
                                label="Description"
                                placeholder="What is the purpose of this app?"
                                component={TextAreaFieldFF}
                                className={styles.field}
                                validate={hasValue}
                            />
                            <ReactFinalForm.Field
                                required
                                name="appType"
                                label="Type"
                                initialValue={defaultAppType}
                                component={SingleSelectFieldFF}
                                className={styles.field}
                                validate={hasValue}
                                options={appTypeOptions}
                            />
                            <ReactFinalForm.Field
                                required
                                name="sourceUrl"
                                label="Source code URL"
                                type="url"
                                placeholder="e.g. https://github.com/user/app"
                                component={InputFieldFF}
                                className={styles.field}
                                validate={hasValue}
                            />
                            <ReactFinalForm.Field
                                name="demoUrl"
                                label="Demo URL"
                                type="url"
                                placeholder="e.g. https://dhis2.org/demo"
                                component={InputFieldFF}
                                className={styles.field}
                            />
                            <ReactFinalForm.Field
                                required
                                name="version"
                                label="Version"
                                placeholder="e.g. 1.0"
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
                                name="channel"
                                label="Channel"
                                initialValue={defaultAppChannel}
                                component={SingleSelectFieldFF}
                                className={styles.field}
                                validate={hasValue}
                                options={channelOptions}
                            />
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.subheader}>Compatibility</h3>
                            <p className={styles.description}>
                                It's important to let App Hub users know what
                                versions of DHIS2 can use this app.
                            </p>
                            <ReactFinalForm.Field
                                required
                                name="minDhisVersion"
                                label="Minimum DHIS version"
                                placeholder="Select a version"
                                component={SingleSelectFieldFF}
                                className={styles.field}
                                validate={hasValue}
                                options={dhisVersionOptions}
                            />
                            <ReactFinalForm.Field
                                name="maxDhisVersion"
                                label="Maximum DHIS version"
                                placeholder="Select a version"
                                component={SingleSelectFieldFF}
                                className={styles.field}
                                validate={maxDhisVersionValidator}
                                options={dhisVersionOptions}
                            />
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.subheader}>
                                Developer information
                            </h3>
                            <p className={styles.description}>
                                This information can help users get in touch
                                with feedback, bug reports and suggestions.
                            </p>
                            <ReactFinalForm.Field
                                required
                                name="developerName"
                                label="Developer name"
                                placeholder="Enter a name"
                                initialValue={user.name}
                                component={InputFieldFF}
                                className={styles.field}
                                validate={hasValue}
                            />
                            <ReactFinalForm.Field
                                required
                                name="developerEmail"
                                label="Developer email"
                                type="email"
                                placeholder="Enter an email address"
                                initialValue={user.email}
                                component={InputFieldFF}
                                className={styles.field}
                                validate={hasValue}
                            />
                            <div className={styles.organisationFieldGroup}>
                                {createOrganisationModal.isVisible && (
                                    <CreateOrganisationModal
                                      mutate={mutate}
                                      onClose={createOrganisationModal.hide}
                                    />
                                )}
                                <ReactFinalForm.Field
                                    required
                                    name="developerOrganisation"
                                    label="Organisation"
                                    placeholder="Select an organisation"
                                    component={SingleSelectFieldFF}
                                    className={styles.organisationField}
                                    validate={hasValue}
                                    options={organisationOptions}
                                />
                                <Button secondary onClick={createOrganisationModal.show}>
                                    Create organisation
                                </Button>
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.subheader}>
                                Upload app file (Required)
                            </h3>
                            <p className={styles.description}>
                                App files should be submitted as zip.
                            </p>
                            <ReactFinalForm.Field
                                required
                                name="file"
                                buttonLabel="Upload a zip file"
                                accept=".zip"
                                component={FileInputFieldFF}
                                className={styles.field}
                                validate={hasValue}
                            />
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.subheader}>
                                Upload logo (Required)
                            </h3>
                            <p className={styles.description}>
                                A logo will be displayed in the App Hub
                                listings. A good-looking logo will help users
                                find your app.
                            </p>
                            <ReactFinalForm.Field
                                required
                                name="logo"
                                buttonLabel="Upload a logo"
                                accept="image/*"
                                component={FileInputFieldFF}
                                className={styles.field}
                                validate={hasValue}
                            />
                        </section>

                        <Button
                            primary
                            type="submit"
                            disabled={!valid || submitting}
                            className={styles.submitButton}
                        >
                            Save and submit
                        </Button>
                    </form>
                )}
            </ReactFinalForm.Form>
        </Card>
    )
}

UserAppUpload.propTypes = {
    user: PropTypes.object.isRequired,
}

export default UserAppUpload
