import React, {Component, PropTypes} from 'react';
import {Card, CardText} from 'material-ui/Card';
import Button from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import {DHISVersions} from '../../constants/apiConstants';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import UploadFileField from '../form/UploadFileField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Field, reduxForm} from 'redux-form';
import * as formUtils from './ReduxFormUtils';
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


const UploadForm = (props) => {
    const {handleSubmit, submitted, pristine, submitting} = props;

    const onSubmit = (values) => {
        const data = {
            name: values.appName,
            description: values.description,
            appType: values.appType,
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
        const imageFile = values.image[0];
        const appFile = values.file[0];
        if (!imageFile) { //should not send this if image is not provided
            data.images = []
        }

        props.submitted({data, file: appFile, image: imageFile});
    }

    const menuItems = appTypes.map((type, i) => (
        <MenuItem key={type.value} value={type.value} primaryText={type.label}/>
    ));

    const fieldStyle = {
        display: 'block',
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Field name="appName" style={fieldStyle} component={formUtils.renderTextField} autoFocus fullWidth label="App Name"/>
            <Field name="description" style={fieldStyle} component={formUtils.renderTextField} fullWidth multiLine rows={3}
                   label="App Description"/>
            <br />
            <Field name="appType" style={fieldStyle} component={formUtils.renderSelectField} fullWidth label="App Type">
                {menuItems}
            </Field>
            <h2>Version</h2>
            <Field name="version" style={fieldStyle} component={formUtils.renderTextField} label="Version"/>
            <Field style={{display: 'block'}} name="minVer" component={formUtils.renderAutoCompleteField}
                   label="Minimum DHIS version" dataSource={DHISVersions}/>
            <Field name="maxVer" style={fieldStyle} component={formUtils.renderAutoCompleteField} label="Maximum DHIS version"
                   dataSource={DHISVersions}/>
            <Field name="file" component={formUtils.renderUploadField} label="Upload app" />
            <h2>Developer</h2>
            <Field name="developerName" style={fieldStyle} component={formUtils.renderTextField} label="Developer Name"/>
            <Field name="developerEmail" style={fieldStyle} component={formUtils.renderTextField} label="Developer Email"/>
            <Field name="developerAddress" style={fieldStyle} component={formUtils.renderTextField} label="Developer Address"/>
            <Field name="developerOrg" style={fieldStyle} component={formUtils.renderTextField} label="Organisation"/>

            <h2>Image</h2>
            <Field name="image" component={formUtils.renderUploadField} hintText="Upload image" id="imageFile"/>
            <Field name="imageCaption" style={fieldStyle} component={formUtils.renderTextField} label="Image caption"/>
            <Field name="imageDescription" style={fieldStyle} component={formUtils.renderTextField} label="Image description"/>

            <Button style={{...fieldStyle, marginTop: '20px'}}
                    icon={<FontIcon className="material-icons">file_upload</FontIcon>} type="submit" primary
                    disabled={pristine || submitting}
                    label="Upload"/>
        </form>

    )
}
UploadForm.propTypes = {
    submitted: PropTypes.func.isRequired,
}
export default reduxForm({form: 'uploadAppForm', validate, initialValues: {appType: appTypes[0].value}})(UploadForm);