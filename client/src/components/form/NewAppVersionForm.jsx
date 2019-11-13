import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Card, CardText } from 'material-ui/Card'
import * as formUtils from './ReduxFormUtils'
import MenuItem from 'material-ui/MenuItem'
import { Field, Form, reduxForm } from 'redux-form'
import config from '../../../../config'
import { validateZipFile, validateURL } from './ReduxFormUtils'

import { loadChannels } from '../../actions/actionCreators'

import ErrorOrLoading from '../utils/ErrorOrLoading'

const DHISVersions = config.ui.dhisVersions

const validate = values => {
    const errors = {}
    const requiredFields = ['version', 'file']
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    return errors
}

const NewAppVersionForm = props => {
    const { handleSubmit, pristine, submitting, submitFailed, channels } = props
    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component

    const onSub = values => {
        const data = {
            version: values.version,
            minDhisVersion: values.minVer,
            maxDhisVersion: values.maxVer,
            channel: values.channel,
            demoUrl: values.demoUrl,
        }
        const file = values.file[0]
        return props.submitted({ data, file: file })
    }

    const loading = channels.loading

    const DHISReleaseChannels = channels.channels.map(c => c.name)

    //TODO: add error instead of passing false to ErrorOrLoading
    return loading ? (
        <ErrorOrLoading loading={loading} error={false} />
    ) : (
        <Form onSubmit={handleSubmit(onSub)}>
            <Field
                name="version"
                component={formUtils.renderTextField}
                autoFocus
                fullWidth
                label="Version"
            />{' '}
            <br />
            <Field
                style={{ display: 'block' }}
                name="minVer"
                component={formUtils.renderAutoCompleteField}
                label="Minimum DHIS version"
                dataSource={DHISVersions}
            />
            <Field
                name="maxVer"
                component={formUtils.renderAutoCompleteField}
                label="Maximum DHIS version"
                dataSource={DHISVersions}
            />
            <Field
                name="channel"
                component={formUtils.renderAutoCompleteField}
                label="Release channel"
                dataSource={DHISReleaseChannels}
            />
            <Field
                name="demoUrl"
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
                id="file"
            />
        </Form>
    )
}

NewAppVersionForm.propTypes = {
    submitted: PropTypes.func.isRequired,
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
