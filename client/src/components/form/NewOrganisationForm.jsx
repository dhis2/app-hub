import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Card, CardText } from 'material-ui/Card'
import Button from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import UploadFileField from './UploadFileField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as formUtils from './ReduxFormUtils'
import { Field, reduxForm, Form } from 'redux-form'

const validate = values => {
    const errors = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    if (values.name && values.name.length > 100) {
        errors.name = 'Name is too long, maximum 100 characters allowed'
    }

    return errors
}

const NewOrganisationForm = props => {
    const { handleSubmit, pristine, submitting } = props

    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component
    const onSub = values => {
        const data = {
            name: values.name,
            email: values.email || null,
        }

        return props.submitted(data)
    }

    return (
        <Form onSubmit={handleSubmit(onSub)}>
            <div style={{ height: '190px' }}>
                <Field
                    name="name"
                    fullWidth
                    component={formUtils.renderTextField}
                    autoFocus
                    label="Organisation name"
                />
                <Field
                    name="email"
                    fullWidth
                    component={formUtils.renderTextField}
                    label="Contact email"
                />
            </div>
        </Form>
    )
}

NewOrganisationForm.propTypes = {}
export default reduxForm({ form: 'newOrganisation', validate })(
    NewOrganisationForm
)
