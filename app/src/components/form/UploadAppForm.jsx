import React, {Component, PropTypes} from 'react';
import {Card, CardText} from 'material-ui/Card';
import Button from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import {DHISVersions} from '../../../config';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import UploadFileField from '../form/UploadFileField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Field, reduxForm} from 'redux-form';
import Divider from 'material-ui/Divider';
import * as formUtils from './ReduxFormUtils';
import {validateZipFile, validateImageFile, validateURL} from '../form/ReduxFormUtils';
import Spinner from '../utils/Spinner';
const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
    {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]

const validate = values => {
    const errors = {}
    const requiredFields = ['appName', 'appType', 'file', 'developerName', 'developerOrg', 'version']
    const varCharFields = ['appName', 'appType', 'sourceUrl', 'version', 'minVer', 'maxVer', 'developerName', 'developerEmail',
        'developerOrg', 'imageCaption', 'imageDescription'];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    varCharFields.forEach(field => {
        if (values[field] && values[field].length > 255) {
            errors[field] = 'Max 255 characters';
        }
    });


    if (values.minVer && values.maxVer && values.minVer > values.maxVer) {
        errors.minVer = 'Cannot be higher than maximum version';
        errors.maxVer = 'Cannot be lower than minimum version'
    }
    return errors
}


const UploadForm = (props) => {
    const {handleSubmit, submitted, submitFailed, pristine, reset, dirty, submitting} = props;

    const onSubmit = (values) => {
        const data = {
            name: values.appName,
            description: values.description,
            appType: values.appType,
            sourceUrl: values.sourceUrl,
            developer: {
                name: values.developerName,
                email: values.developerEmail,
                address: values.developerAddress || "",
                organisation: values.developerOrg,
            },
            versions: [{
                version: values.version,
                minDhisVersion: values.minVer,
                maxDhisVersion: values.maxVer,
                demoUrl: values.demoUrl,
            }],
            images: [{
                caption: values.imageCaption,
                description: values.imageDescription,
            }]
        }
        const imageFile = values.image ? values.image[0] : null;
        const appFile = values.file[0];
        if (!imageFile) { //should be empty if image is not provided
            data.images = []
        }

        props.submitted({data, file: appFile, image: imageFile});
    }

    const menuItems = appTypes.map((type, i) => (
        <MenuItem key={type.value} value={type.value} primaryText={type.label}/>
    ));
    const DHISVersionItems = DHISVersions.map((version, i) => (
        <MenuItem key={version} value={version} primaryText={version}/>
    ))

    const fieldStyle = {}
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Field name="appName" style={fieldStyle} component={formUtils.renderTextField} autoFocus fullWidth
                   label="App Name *"
            />
            <Field name="description" style={fieldStyle} component={formUtils.renderTextField} fullWidth multiLine
                   rows={1}
                   label="App Description"/>
            <br />
            <Field name="sourceUrl" style={fieldStyle} component={formUtils.renderTextField} label="Source Code URL"
                validate={validateURL}/>
            <br />
            <Field name="appType" component={formUtils.renderSelectField} label="App Type">
                {menuItems}
            </Field>
            <h2>Version</h2>
            <Field name="version" style={fieldStyle} component={formUtils.renderTextField} label="Version *"/>
            <br />
            <Field style={fieldStyle} name="minVer" component={formUtils.renderSelectField}
                   label="Minimum DHIS version">
                {DHISVersionItems}
            </Field>
            <br />
            <Field name="maxVer" style={fieldStyle} component={formUtils.renderSelectField}
                   label="Maximum DHIS version">
                {DHISVersionItems}
            </Field>
            <br />
            <Field name="demoUrl" style={fieldStyle} component={formUtils.renderTextField}
                   label="Demo URL"
                   validate={validateURL}>
            </Field>

            <br />
            <Field name="file" style={{height: 72}} component={formUtils.renderUploadField}
                   accept=".zip"
                   validate={validateZipFile}
                   formMeta={{dirty, submitFailed}}
                   label="Upload app *"/>
            <Divider />
            <h2>Developer</h2>
            <Field name="developerName" style={fieldStyle} component={formUtils.renderTextField}
                   label="Developer Name *"/>
            <br />
            <Field name="developerEmail" style={fieldStyle} component={formUtils.renderTextField}
                   label="Developer Email"/>
            <br />
            <Field name="developerOrg" style={fieldStyle} component={formUtils.renderTextField}
                   label="Organisation *"/>

            <h2>Image</h2>
            <p>You can upload additional images and set preview image once your app has been uploaded.</p>
            <Field name="image" component={formUtils.renderUploadField} accept="image/*" hintText="Upload logo"
                   validate={validateImageFile}
                   id="imageFile"/>
            <br />
            <Field name="imageCaption" style={fieldStyle} component={formUtils.renderTextField} label="Image caption"/>
            <br />
            <Field name="imageDescription" style={fieldStyle} component={formUtils.renderTextField}
                   label="Image description"/>
            <br />
            <Button style={{...fieldStyle, marginTop: '20px'}}
                    icon={submitting ? <Spinner /> : <FontIcon className="material-icons">file_upload</FontIcon>} type="submit" primary
                    disabled={pristine || submitting}
                    label={!submitting ? "Upload" : null}/>
        </form>

    )
}
UploadForm.propTypes = {
    submitted: PropTypes.func.isRequired,
}
export default reduxForm({form: 'uploadAppForm', validate, initialValues: {appType: appTypes[0].value}})(UploadForm);