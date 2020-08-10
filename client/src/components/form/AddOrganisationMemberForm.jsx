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
    if(!values.email) {
        errors.email = 'Required'
    }

    return errors
}

const AddOrganisationMemberForm = props => {
    const { handleSubmit, pristine, submitting } = props

    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component
    const onSub = values => {
        const data = {
            email: values.email,
        }

        return props.submitted(data)
    }

    return (
        <Form onSubmit={handleSubmit(onSub)}>
            <Field
                name="email"
                component={formUtils.renderTextField}
                autoFocus
                label="Email address"
            />
        </Form>
    )
}

AddOrganisationMemberForm.propTypes = {}
export default reduxForm({ form: 'addOrganisationMember', validate })(
    AddOrganisationMemberForm
)
