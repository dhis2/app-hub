// eslint-disable-next-line react/no-deprecated
import React, { PropTypes } from 'react'

import { connect } from 'react-redux'
import * as formUtils from './ReduxFormUtils'
import MenuItem from 'material-ui/MenuItem'
import { Field, Form, reduxForm } from 'redux-form'
import semverClean from 'semver/functions/valid'

import { validateURL, validateVersion } from './ReduxFormUtils'

import { loadChannels } from '../../actions/actionCreators'

import ErrorOrLoading from '../utils/ErrorOrLoading'

import DHISVersionItems from '../appVersion/VersionItems'

const validate = values => {
    const errors = {}
    const requiredFields = ['version', 'minDhisVersion', 'maxDhisVersion']
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    const uriFields = ['demoUrl']
    uriFields.forEach(field => {
        if (values[field]) {
            const validationError = validateURL(values[field])
            if (validationError) {
                errors[field] = validationError
            }
        }
    })

    if (values.version) {
        errors.version = validateVersion(values.version)
    }

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

const EditAppVersionForm = props => {
    const { handleSubmit, submitted, change } = props

    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component

    const onSub = values => {
        values.demoUrl = values.demoUrl || ''
        return submitted(values)
    }

    const { channels } = props

    const loading = channels ? channels.loading : false

    const releaseChannels = channels
        ? channels.list.map(channel => (
              <MenuItem
                  key={channel.name}
                  value={channel.name}
                  primaryText={channel.name}
              />
          ))
        : null

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
                onBlur={event => {
                    const { value } = event.target
                    const semverStr = semverClean(value, {
                        loose: true,
                        includePrerelease: true,
                    })
                    if (semverStr) {
                        event.preventDefault()
                        change('version', semverStr)
                    }
                }}
            />
            <br />
            <Field
                name="minDhisVersion"
                component={formUtils.renderSelectField}
                label="Minimum DHIS version"
            >
                {DHISVersionItems}
            </Field>
            <Field
                name="maxDhisVersion"
                component={formUtils.renderSelectField}
                label="Maximum DHIS version"
            >
                {DHISVersionItems}
            </Field>
            <Field
                name="channel"
                component={formUtils.renderSelectField}
                label="Release channel"
            >
                {releaseChannels}
            </Field>
            <Field
                name="demoUrl"
                component={formUtils.renderTextField}
                fullWidth
                label="Demo URL"
            />
        </Form>
    )
}

EditAppVersionForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    channels: PropTypes.object,
    submitted: PropTypes.func,
}

const mapStateToProps = state => ({
    channels: state.channels,
})

const mapDispatchToProps = dispatch => ({
    loadChannels() {
        dispatch(loadChannels())
    },
})

const ConnectedEditAppVersionForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditAppVersionForm)

export default reduxForm({ form: 'editAppVersionForm', validate })(
    ConnectedEditAppVersionForm
)
