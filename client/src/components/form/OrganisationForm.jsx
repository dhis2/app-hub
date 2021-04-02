import PropTypes from 'prop-types'
import React from 'react'
import { Field, reduxForm, Form } from 'redux-form'
import * as formUtils from './ReduxFormUtils'

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

const OrganisationForm = props => {
    const { handleSubmit } = props

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

OrganisationForm.propTypes = {
    submitted: PropTypes.func.isRequired,
}

export default reduxForm({ form: 'organisationForm', validate })(
    OrganisationForm
)
