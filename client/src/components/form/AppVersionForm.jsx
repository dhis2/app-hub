// eslint-disable-next-line react/no-deprecated
import PropTypes from 'prop-types';

import React from 'react';

import { connect } from 'react-redux'
import * as formUtils from './ReduxFormUtils'
import MenuItem from 'material-ui/MenuItem'
import { Field, Form, reduxForm } from 'redux-form'

import { validateZipFile, validateURL, validateVersion } from './ReduxFormUtils'

import ErrorOrLoading from '../utils/ErrorOrLoading'

import DHISVersionItems from '../appVersion/VersionItems'

const validate = (values, isNew) => {
    const errors = {}
    const requiredFields = [
        'version',
        isNew ? 'file' : undefined,
        'channel',
        'minDhisVersion',
        'maxDhisVersion',
    ]
    requiredFields.forEach(field => {
        if (field && !values[field]) {
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

    return errors
}

const AppVersionForm = props => {
    const { handleSubmit, submitFailed, submitted, channels, isNew } = props
    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component

    const onSub = values => {
        values.demoUrl = values.demoUrl || ''
        return submitted({
            data: values,
            file: isNew ? values.file[0] : undefined,
        })
    }

    //TODO: add error instead of passing false to ErrorOrLoading
    return channels.loading || channels.error ? (
        <ErrorOrLoading loading={channels.loading} error={channels.error} />
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
                {channels.list.map(channel => (
                    <MenuItem
                        key={channel.name}
                        value={channel.name}
                        primaryText={channel.name}
                    />
                ))}
            </Field>
            <Field
                name="demoUrl"
                fullWidth
                component={formUtils.renderTextField}
                label="Demo URL"
                validate={validateURL}
            />
            {isNew && (
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
            )}
        </Form>
    )
}

AppVersionForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isNew: PropTypes.bool.isRequired,
    submitFailed: PropTypes.bool.isRequired,
    submitted: PropTypes.func.isRequired,
    channels: PropTypes.object,
}

const mapStateToProps = state => ({
    channels: state.channels,
})

const ConnectedNewAppVersionForm = connect(mapStateToProps)(AppVersionForm)

export default reduxForm({ form: 'appVersionForm', validate })(
    ConnectedNewAppVersionForm
)
