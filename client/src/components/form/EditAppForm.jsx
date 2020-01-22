import React, { Component, PropTypes } from 'react'
import { Card, CardText } from 'material-ui/Card'
import Button from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import UploadFileField from './UploadFileField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as formUtils from './ReduxFormUtils'
import { Field, reduxForm, Form } from 'redux-form'
import { validateURL } from './ReduxFormUtils'
import config from '../../../config'

const appTypes = Object.keys(config.ui.appTypeToDisplayName).map(key => ({
    value: key,
    label: config.ui.appTypeToDisplayName[key],
}))

const validate = values => {
    const errors = {}
    const requiredFields = [
        'appName',
        'appType',
        'file',
        'developerName',
        'developerEmail',
        'developerOrg',
        'version',
    ]
    const varCharFields = [
        'appName',
        'sourceUrl',
        'appType',
        'developerName',
        'developerEmail',
        'developerOrg',
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Field is required.'
        }
    })
    varCharFields.forEach(field => {
        if (values[field] && values[field].length > 255) {
            errors[field] = 'Max 255 characters'
        }
    })

    return errors
}

const EditForm = props => {
    const { handleSubmit, pristine, submitting } = props
    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component
    const onSub = values => {
        const data = {
            name: values.appName,
            sourceUrl: values.sourceUrl,
            appType: values.appType,
            description: values.description,
            developer: {
                name: values.developerName,
                email: values.developerEmail,
                address: values.developerAddress,
                organisation: values.developerOrg,
            },
        }

        return props.submitted({ data })
    }

    const menuItems = appTypes.map((type, i) => (
        <MenuItem
            key={type.value}
            value={type.value}
            primaryText={type.label}
        />
    ))

    return (
        <Form onSubmit={handleSubmit(onSub)}>
            <Field
                name="appName"
                component={formUtils.renderTextField}
                autoFocus
                fullWidth
                label="App Name"
            />{' '}
            <br />
            <Field
                name="description"
                component={formUtils.renderTextField}
                fullWidth
                multiLine
                rows={3}
                label="App Description"
            />
            <br />
            <Field
                name="sourceUrl"
                component={formUtils.renderTextField}
                label="Source Code URL"
                validate={validateURL}
            />
            <br />
            <Field
                name="appType"
                component={formUtils.renderSelectField}
                fullWidth
                label="App Type"
            >
                {menuItems}
            </Field>{' '}
            <br />
            <h3>Developer</h3>
            <Field
                name="developerName"
                component={formUtils.renderTextField}
                label="Developer Name"
                disabled={true}
            />
            <Field
                name="developerEmail"
                component={formUtils.renderTextField}
                label="Developer Email"
                disabled={true}
            />
            <Field
                name="developerAddress"
                component={formUtils.renderTextField}
                label="Developer Address"
                disabled={true}
            />
            <Field
                name="developerOrg"
                component={formUtils.renderTextField}
                label="Organisation"
                disabled={true}
            />
        </Form>
    )
}
EditForm.propTypes = {
    //Callback for the values when the form has been submitted.
    submitted: PropTypes.func,
    //Submits the form, given by Redux-form "Form"-component.
    submit: PropTypes.func,
}
export default reduxForm({ form: 'editAppForm', validate })(EditForm)
