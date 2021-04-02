import { Card, CardText } from 'material-ui/Card'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem'
import Button from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Field, reduxForm, Form } from 'redux-form'
import * as formUtils from './ReduxFormUtils'
import UploadFileField from './UploadFileField'

const validate = values => {
    const errors = {}
    if (!values.email) {
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
            <div style={{ height: '72px' }}>
                <Field
                    name="email"
                    component={formUtils.renderTextField}
                    autoFocus
                    label="Email address"
                />
            </div>
        </Form>
    )
}

AddOrganisationMemberForm.propTypes = {}
export default reduxForm({ form: 'addOrganisationMember', validate })(
    AddOrganisationMemberForm
)
