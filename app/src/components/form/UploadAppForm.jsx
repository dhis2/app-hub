import React, {Component, PropTypes} from 'react';
import {Card, CardText} from 'material-ui/Card';
import Button from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import UploadFileField from '../form/UploadFileField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Field, reduxForm} from 'redux-form';

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

const renderTextField = ({input, label, meta: {touched, error}, ...props}) => (
    <TextField hintText={label}
               floatingLabelText={label}
               errorText={touched && error}
               {...input}
               {...props}
    />
)

const renderSelectField = ({input, label, meta: {touched, error}, children}) => (
    <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        value={1}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        children={children}/>
)

const renderUploadField = ({input, label, meta: {touched, error}, children, ...props}) => (
    <UploadFileField handleUpload={(file) => input.onChange(file)} {...props} />
)

const UploadForm = (props) => {
    const {handleSubmit, submitted, pristine, submitting} = props;

    const onSubmit = (values) => {
        const data = {
            name: values.appName,
            description: values.description,
            developer: {
                name: values.developerName,
                email: values.developerEmail,
                address: values.developerAddress,
                organisation: values.developerOrg,
            },
            versions: [{
                version: values.version,
                minDhisVersion: values.minVer,
                maxDhisVersion: values.maxVer
            }],
            images: [{
                caption: values.imageCaption,
                description: values.imageDescription,
            }]
        }
        if(!values.image) { //should not send this if image is not provided
            data.images = []
        }
        props.submitted({data, file: values.file, image: values.image});
    }

    const menuItems = appTypes.map((type, i) => (
        <MenuItem key={type.value} value={type.value} primaryText={type.label}/>
    ));

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Field name="appName" component={renderTextField} fullWidth label="App Name"/> <br />
            <Field name="description" component={renderTextField} fullWidth multiLine rows={3} label="App Description"/>
            <br />
            <Field name="appType" component={renderSelectField} fullWidth label="App Type">
                {menuItems}
            </Field> <br />
            <Field name="file" component={renderUploadField} defaultText="Upload app" id="file"/>
            <Field name="version" component={renderTextField} fullWidth label="Version" />
            <Field name="minVer" component={renderTextField} label="Minimum DHIS version" />
            <Field name="maxVer" component={renderTextField} label="Maximum DHIS version" />

            <h2>Developer</h2>
            <Field name="developerName" component={renderTextField} label="Developer Name"/>
            <Field name="developerEmail" component={renderTextField} label="Developer Email"/>
            <Field name="developerAddress" component={renderTextField} label="Developer Address"/>
            <Field name="developerOrg" component={renderTextField} label="Organisation"/>

            <h2>Image</h2>
            <Field name="image" component={renderUploadField} defaultText="Upload image" id="imageFile" />
            <Field name="imageCaption" component={renderTextField} label="Image caption"/>
            <Field name="imageDescription" component={renderTextField} label="Image description"/>
            <Button icon={<FontIcon className="material-icons">file_upload</FontIcon>} type="submit" primary
                    disabled={pristine || submitting}
                    label="Upload"/>
        </form>

    )
}
UploadForm.propTypes = {
    submitted: PropTypes.func.isRequired,
}
export default reduxForm({form: 'uploadAppForm', validate, initialValues: {appType: appTypes[0].value}})(UploadForm);