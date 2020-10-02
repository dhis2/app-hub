// eslint-disable-next-line react/no-deprecated
import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import * as formUtils from './ReduxFormUtils'
import MenuItem from 'material-ui/MenuItem'
import { Field, Form, reduxForm } from 'redux-form'

import { validateZipFile, validateURL, validateVersion} from './ReduxFormUtils'

import { loadChannels } from '../../actions/actionCreators'

import ErrorOrLoading from '../utils/ErrorOrLoading'

import DHISVersionItems from '../appVersion/VersionItems'

const validate = values => {
    const errors = {}
    const requiredFields = [
        'version',
        'file',
        'channel',
        'minDhisVersion',
        'maxDhisVersion',
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.minDhisVersion &&
        values.maxDhisVersion &&
        values.minDhisVersion > values.maxDhisVersion
    ) {
        errors.minDhisVersion = 'Cannot be higher than maximum version'
        errors.maxDhisVersion = 'Cannot be lower than minimum version'
    }

    if (values.version) {
        errors.version = validateVersion(values.version)
    }

    return errors
}

const NewAppVersionForm = props => {
    const { handleSubmit, submitFailed, channels, change } = props
    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component

    const onSub = values => {
        values.demoUrl = values.demoUrl || ''
        const file = values.file[0]
        return props.submitted({ data: values, file: file })
    }

    const loading = channels.loading

    const releaseChannels = channels.list.map(channel => (
        <MenuItem
            key={channel.name}
            value={channel.name}
            primaryText={channel.name}
        />
    ))

    //TODO: add error instead of passing false to ErrorOrLoading
    return loading ? (
        <ErrorOrLoading loading={loading} error={false} />
    ) : (
        <Form onSubmit={handleSubmit(onSub)}>
            <Field
                component={formUtils.VersionField}
                autoFocus
                name="version"
                validate={validateVersion}
            />
            <Field
                name="minDhisVersion"
                component={formUtils.renderSelectField}
                label="Minimum DHIS version"
                hintText={'Select version'}
            >
                {DHISVersionItems}
            </Field>
            <Field
                name="maxDhisVersion"
                component={formUtils.renderSelectField}
                label="Maximum DHIS version"
                hintText={'Select version'}
            >
                {DHISVersionItems}
            </Field>
            <Field
                name="channel"
                component={formUtils.renderSelectField}
                label="Release channel"
                hintText={'Select channel'}
            >
                {releaseChannels}
            </Field>
            <Field
                name="demoUrl"
                fullWidth
                component={formUtils.renderTextField}
                label="Demo URL"
                validate={validateURL}
            />
            <Field
                name="file"
                component={formUtils.renderUploadField}
                validate={validateZipFile}
                formMeta={{ submitFailed }}
                accept=".zip"
                label="Upload version"
                hintText="Select a file to upload"
                id="file"
            />
        </Form>
    )
}

NewAppVersionForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitFailed: PropTypes.bool.isRequired,
    submitted: PropTypes.func.isRequired,
    channels: PropTypes.object,
}

const mapStateToProps = state => ({
    channels: state.channels,
})

const mapDispatchToProps = dispatch => ({
    loadChannels() {
        dispatch(loadChannels())
    },
})

const ConnectedNewAppVersionForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewAppVersionForm)

export default reduxForm({ form: 'newAppVersionForm', validate })(
    ConnectedNewAppVersionForm
)
