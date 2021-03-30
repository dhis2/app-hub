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
    const maxLenCaption = 60
    if (values['caption'] && values['caption'].length > maxLenCaption) {
        errors['caption'] = `Max ${maxLenCaption} characters`
    }

    return errors
}

const EditImageForm = props => {
    const { handleSubmit, pristine, submitting } = props
    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component
    const onSub = values => {
        const data = {
            caption: values.caption,
            description: values.description,
            logo: values.logo ? values.logo : false,
        }

        return props.submitted(data)
    }

    return (
        <Form onSubmit={handleSubmit(onSub)}>
            <Field
                name="caption"
                component={formUtils.renderTextField}
                autoFocus
                label="Image Caption"
            />{' '}
            <br />
            <Field
                name="description"
                component={formUtils.renderTextField}
                multiLine
                rows={1}
                label="Image Description"
            />
            <Field
                name="logo"
                component={formUtils.renderToggle}
                label="Set as logo for app"
            />
        </Form>
    )
}
EditImageForm.propTypes = {}
export default reduxForm({ form: 'editImageForm', validate })(EditImageForm)
