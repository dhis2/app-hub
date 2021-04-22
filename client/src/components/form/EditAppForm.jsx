// eslint-disable-next-line react/no-deprecated
import PropTypes from 'prop-types'

import React from 'react'
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
        'developerOrg',
        'version',
    ]
    const varCharFields = [
        'appName',
        'sourceUrl',
        'appType',
        'contactEmail',
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
    const { handleSubmit, submitted } = props
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
                email: values.contactEmail,
                address: values.developerAddress,
                organisation: values.developerOrg,
            },
        }

        return submitted({ data })
    }

    const menuItems = appTypes.map(type => (
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
                fullWidth
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
                name="contactEmail"
                component={formUtils.renderTextField}
                label="Contact Email"
                disabled={true}
                fullWidth
            />
            <Field
                name="developerAddress"
                component={formUtils.renderTextField}
                label="Developer Address"
                disabled={true}
                fullWidth
            />
            <Field
                name="developerOrg"
                component={formUtils.renderTextField}
                label="Organisation"
                disabled={true}
                fullWidth
            />
        </Form>
    )
}
EditForm.propTypes = {
    //Submits the form, given by Redux-form "Form"-component.
    handleSubmit: PropTypes.func.required,
    //Callback for the values when the form has been submitted.
    submitted: PropTypes.func.required,
}

//const mapDispatch
const reduxFormed = reduxForm({ form: 'editAppForm', validate })(EditForm)
export default reduxFormed
