import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import config from '../../../config'
import MenuItem from 'material-ui/MenuItem'
import { Field, FormSection } from 'redux-form'
import * as formUtils from './ReduxFormUtils'
import {
    validateZipFile,
    validateImageFile,
    validateURL,
    hasError,
    validateVersion,
} from './ReduxFormUtils'
import FormStepper from './FormStepper'
import OrganisationSelector from './helpers/OrganisationSelectorField'
import { loadChannels } from '../../actions/actionCreators'
import * as userSelectors from '../../selectors/userSelectors'
import ErrorOrLoading from '../utils/ErrorOrLoading'
import DHISVersionItems from '../appVersion/VersionItems'

const FORM_NAME = 'uploadAppForm'
const appTypes = Object.keys(config.ui.appTypeToDisplayName).map(key => ({
    value: key,
    label: config.ui.appTypeToDisplayName[key],
}))

const requiredFields = {
    general: ['appName', 'appType'],
    version: ['file', 'version', 'channel', 'minVer', 'maxVer'],
    developer: ['developerName', 'developerEmail', 'developerOrg'],
    image: [],
}

const varCharFields = {
    general: ['appName', 'appType', 'sourceUrl'],
    version: ['version'],
    developer: ['developerName', 'developerEmail', 'developerOrg'],
    image: ['imageCaption', 'imageDescription'],
}

const validateSection = (values, section) => {
    const errors = {}
    requiredFields[section].forEach(field => {
        if (!values) {
            errors[field] = 'Required'
            return
        }
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    varCharFields[section].forEach(field => {
        if (values && values[field] && values[field].length > 255) {
            errors[field] = 'Max 255 characters'
        }
    })

    return errors
}

const validate = values => {
    const errors = {}
    errors.general = validateSection(values.general, 'general')
    errors.version = validateSection(values.version, 'version')
    errors.developer = validateSection(values.developer, 'developer')
    errors.image = validateSection(values.image, 'image')

    if (
        values.version &&
        values.version.minVer &&
        values.version.maxVer &&
        values.version.minVer > values.version.maxVer
    ) {
        errors.version.minVer = 'Cannot be higher than maximum version'
        errors.version.maxVer = 'Cannot be lower than minimum version'
    }

    //Check if any subsection has error
    if (hasError(errors)) {
        errors._error =
            'Your submission contains an error. Please check previous steps and try again.'
    }
    return errors
}

const appTypesItems = appTypes.map(type => (
    <MenuItem key={type.value} value={type.value} primaryText={type.label} />
))

const AppGeneralSection = props => {
    return (
        <FormSection name={props.name}>
            <Field
                name="appName"
                autoFocus
                component={formUtils.renderTextField}
                fullWidth
                label="App Name *"
            />
            <Field
                name="description"
                component={formUtils.renderTextField}
                fullWidth
                multiLine
                rows={1}
                label="App Description"
            />
            <Field
                name="sourceUrl"
                fullWidth
                component={formUtils.renderTextField}
                label="Source Code URL"
                validate={validateURL}
            />
            <Field
                name="appType"
                component={formUtils.renderSelectField}
                label="App Type"
            >
                {appTypesItems}
            </Field>
        </FormSection>
    )
}

AppGeneralSection.propTypes = {
    name: PropTypes.string,
}

AppGeneralSection.defaultProps = {
    name: 'general',
}

const AppVersionSection = props => {
    const releaseChannels = props.channels.map(channel => (
        <MenuItem
            key={channel.name}
            value={channel.name}
            primaryText={channel.name}
        />
    ))
    return (
        <FormSection name={props.name}>
            <Field
                component={formUtils.VersionField}
                validate={validateVersion}
                autoFocus
                name="version"
            />
            <Field
                name="minVer"
                component={formUtils.renderSelectField}
                hintText={'Select version'}
                label="Minimum DHIS version *"
            >
                {DHISVersionItems}
            </Field>
            <br />
            <Field
                name="maxVer"
                component={formUtils.renderSelectField}
                label="Maximum DHIS version *"
                hintText={'Select version'}
            >
                {DHISVersionItems}
            </Field>
            <br />
            <Field
                name="channel"
                component={formUtils.renderSelectField}
                label="Release channel *"
                hintText={'Select channel'}
            >
                {releaseChannels}
            </Field>
            <br />
            <Field
                name="demoUrl"
                fullWidth
                component={formUtils.renderTextField}
                label="Demo URL"
                validate={validateURL}
            />

            <br />
            <Field
                name="file"
                style={{ height: 72 }}
                component={formUtils.renderUploadField}
                accept=".zip"
                validate={validateZipFile}
                label="Upload app *"
                hintText="Select a file to upload"
            />
        </FormSection>
    )
}

AppVersionSection.propTypes = {
    channels: PropTypes.array,
    name: PropTypes.string,
}

AppVersionSection.defaultProps = {
    name: 'version',
}

const AppDeveloperSection = props => {
    return (
        <FormSection name={props.name}>
            <Field
                name="developerName"
                fullWidth
                autoFocus
                component={formUtils.renderTextField}
                label="Developer Name *"
            />
            <Field
                name="developerEmail"
                fullWidth
                component={formUtils.renderTextField}
                label="Developer Email *"
            />
            <Field
                name="developerOrg"
                component={OrganisationSelector}
                label="Organisation *"
                organisations={props.organisations}
            />
        </FormSection>
    )
}

AppDeveloperSection.propTypes = {
    name: PropTypes.string,
}

AppDeveloperSection.defaultProps = {
    name: 'developer',
}

const AppImageSection = props => {
    return (
        <FormSection name={props.name}>
            <p>
                You can upload additional images and set preview image once your
                app has been uploaded.
            </p>
            <Field
                name="image"
                component={formUtils.renderUploadField}
                accept="image/*"
                label="Upload logo"
                validate={validateImageFile}
                id="imageFile"
            />
            <br />
            <Field
                name="imageCaption"
                component={formUtils.renderTextField}
                label="Image caption"
            />
            <br />
            <Field
                name="imageDescription"
                multiLine
                fullWidth
                component={formUtils.renderTextField}
                label="Image description"
            />
            <br />
        </FormSection>
    )
}

AppImageSection.propTypes = {
    name: PropTypes.string,
}

AppImageSection.defaultProps = {
    name: 'image',
}

class UploadAppFormStepper extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loadChannels()
    }
    /**
     * Get the values from redux-form when submitted (after validation)
     * The values are structured according to the FormSection-names and their
     * respective Fields.
     *
     * Calls this.props.submitted(), with data from the form converted to
     * a format the api understands.
     * @param values
     */
    onSubmit(values) {
        const data = {
            name: values.general.appName,
            description: values.general.description,
            appType: values.general.appType,
            sourceUrl: values.general.sourceUrl,
            developer: {
                name: values.developer.developerName,
                email: values.developer.developerEmail,
                address: values.developer.developerAddress || '',
                organisation: values.developer.developerOrg,
            },
            versions: [
                {
                    version: values.version.version,
                    minDhisVersion: values.version.minVer,
                    maxDhisVersion: values.version.maxVer,
                    demoUrl: values.version.demoUrl,
                    channel: values.version.channel,
                },
            ],
            images: [
                {
                    caption: values.image ? values.image.imageCaption : '',
                    description: values.image
                        ? values.image.imageDescription
                        : '',
                },
            ],
        }
        const imageFile =
            values.image && values.image.image ? values.image.image[0] : null

        data.images = imageFile ? data.images : []
        const appFile = values.version.file[0]

        this.props.submitted({ data, file: appFile, image: imageFile })
    }

    render() {
        const loading = this.props.channels.loading
        //TODO: add error instead of passing false to ErrorOrLoading
        return loading ? (
            <ErrorOrLoading loading={loading} error={false} />
        ) : (
            <FormStepper
                form={FORM_NAME}
                onSubmit={this.onSubmit.bind(this)}
                validate={validate}
                sections={[
                    <AppGeneralSection key="general" name="general" />,
                    <AppVersionSection
                        key="version"
                        name="version"
                        channels={this.props.channels.list}
                    />,
                    <AppDeveloperSection
                        key="developer"
                        name="developer"
                        organisations={this.props.organisations}
                    />,
                    <AppImageSection key="image" name="image" />,
                ]}
                isManager={this.props.isManager}
                initialValues={{ general: { appType: appTypes[0].value } }}
            />
        )
    }
}
UploadAppFormStepper.propTypes = {
    submitted: PropTypes.func.isRequired,
}

UploadAppFormStepper.defaultProps = {}

const mapStateToProps = state => ({
    channels: state.channels,
    isManager: userSelectors.isManager(state),
})

const mapDispatchToProps = dispatch => ({
    loadChannels() {
        dispatch(loadChannels())
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadAppFormStepper)
