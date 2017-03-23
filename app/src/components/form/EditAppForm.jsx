import React, {Component, PropTypes} from 'react';
import {Card, CardText} from 'material-ui/Card';
import Button from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import UploadFileField from '../form/UploadFileField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import * as formUtils from './ReduxFormUtils';
import {Field, reduxForm, Form} from 'redux-form';

const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
    {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]

const validate = values => {
    const errors = {}
    const requiredFields = ['appName', 'appType', 'file', 'developerName', 'developerOrg', 'version']
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Field is required.'
        }
    })
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    return errors
}

const EditForm = (props) => {
    const {handleSubmit, pristine, submitting} = props;
    //this is called when the form is submitted, translating
    //fields to an object the api understands.
    //we then call props.submitted, so this data can be passed to parent component
    const onSub = (values) => {
        const data = {
            name: values.appName,
            appType: values.appType,
            description: values.description,
            developer: {
                name: values.developerName,
                email: values.developerEmail,
                address: values.developerAddress,
                organisation: values.developerOrg,
            }
        }

        return props.submitted({data});
    }

    const menuItems = appTypes.map((type, i) => (
        <MenuItem key={type.value} value={type.value} primaryText={type.label}/>
    ));

    return (
        <Form onSubmit={handleSubmit(onSub)}>
            <Field name="appName" component={formUtils.renderTextField} autoFocus fullWidth label="App Name"/> <br />
            <Field name="description" component={formUtils.renderTextField} fullWidth multiLine rows={3} label="App Description"/>
            <br />
            <Field name="appType" component={formUtils.renderSelectField} fullWidth label="App Type">
                {menuItems}
            </Field> <br />
            <h2>Developer</h2>
            <Field name="developerName" component={formUtils.renderTextField} label="Developer Name"/>
            <Field name="developerEmail" component={formUtils.renderTextField} label="Developer Email"/>
            <Field name="developerAddress" component={formUtils.renderTextField} label="Developer Address"/>
            <Field name="developerOrg" component={formUtils.renderTextField} label="Organisation"/>

        </Form>

    )
}
EditForm.propTypes = {
}
export default reduxForm({form: 'editAppForm', validate})(EditForm);