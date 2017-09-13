import React, { Component, PropTypes } from "react";
import { Card, CardText } from "material-ui/Card";
import config from "../../config";
import MenuItem from "material-ui/MenuItem";
import { Field, FormSection } from "redux-form";
import * as formUtils from "./ReduxFormUtils";
import {
    validateZipFile,
    validateImageFile,
    validateURL,
    hasError
} from "../form/ReduxFormUtils";
import { red500 } from "material-ui/styles/colors";
import FormStepper from "./FormStepper";
import PersonIcon from "material-ui/svg-icons/social/person";
import ImageIcon from "material-ui/svg-icons/editor/insert-photo";
import VersionIcon from "material-ui/svg-icons/";

const appTypes = Object.keys(config.ui.appTypeToDisplayName).map(key => ({
    value: key,
    label: config.ui.appTypeToDisplayName[key]
}));

const requiredFields = {
    general: ["appName", "appType"],
    version: ["file", "version"],
    developer: ["developerName", "developerOrg"],
    image: []
};

const varCharFields = {
    general: ["appName", "appType", "sourceUrl"],
    version: ["version", "minVer", "maxVer"],
    developer: ["developerName", "developerEmail", "developerOrg"],
    image: ["imageCaption", "imageDescription"]
};

const validateSection = (values, section) => {
    const errors = {};
    requiredFields[section].forEach(field => {
        if (!values) {
            errors[field] = "Required";
            return;
        }
        if (!values[field]) {
            errors[field] = "Required";
        }
    });

    varCharFields[section].forEach(field => {
        if (values && values[field] && values[field].length > 255) {
            errors[field] = "Max 255 characters";
        }
    });

    return errors;
};

const validate = values => {
    const errors = {};
    errors.general = validateSection(values.general, "general");
    errors.version = validateSection(values.version, "version");
    errors.developer = validateSection(values.developer, "developer");
    errors.image = validateSection(values.image, "image");

    if (
        values.version &&
        values.version.minVer &&
        values.version.maxVer &&
        values.version.minVer > values.version.maxVer
    ) {
        errors.version.minVer = "Cannot be higher than maximum version";
        errors.version.maxVer = "Cannot be lower than minimum version";
    }
    //Check if any subsection has error
    if (hasError(errors)) {
        errors._error =
            "Your submission contains an error. Please check previous steps and try again.";
    }
    return errors;
};

const appTypesItems = appTypes.map((type, i) => (
    <MenuItem key={type.value} value={type.value} primaryText={type.label} />
));
const DHISVersionItems = config.ui.dhisVersions.map((version, i) => (
    <MenuItem key={version} value={version} primaryText={version} />
));

const AppGeneralSection = props => {
    return (
        <FormSection name={props.name}>
            <Field
                name="appName"
                component={formUtils.renderTextField}
                fullWidth
                label="App Name *"
            />
            <Field
                name="description"
                component={formUtils.renderTextField}
                fullWidth
                multiLine
                rows={1}
                label="App Description"
            />
            <br />
            <Field
                name="sourceUrl"
                component={formUtils.renderTextField}
                label="Source Code URL"
                validate={validateURL}
            />
            <br />
            <Field
                name="appType"
                component={formUtils.renderSelectField}
                label="App Type"
            >
                {appTypesItems}
            </Field>
        </FormSection>
    );
};

AppGeneralSection.propTypes = {
    name: PropTypes.string
};

AppGeneralSection.defaultProps = {
    name: "general"
};

const AppVersionSection = props => {
    return (
        <FormSection name={props.name}>
            <Field
                name="version"
                component={formUtils.renderTextField}
                autoFocus
                label="Version *"
            />
            <br />
            <Field
                name="minVer"
                component={formUtils.renderSelectField}
                label="Minimum DHIS version"
            >
                {DHISVersionItems}
            </Field>
            <br />
            <Field
                name="maxVer"
                component={formUtils.renderSelectField}
                label="Maximum DHIS version"
            >
                {DHISVersionItems}
            </Field>
            <br />
            <Field
                name="demoUrl"
                component={formUtils.renderTextField}
                label="Demo URL"
                validate={validateURL}
            />

            <br />
            <Field
                name="file"
                style={{ height: 72 }}
                component={formUtils.renderUploadField}
                accept=".zip"
                validate={validateZipFile}
                label="Upload app *"
            />
        </FormSection>
    );
};

AppVersionSection.propTypes = {
    name: PropTypes.string,
    formState: PropTypes.object
};

AppVersionSection.defaultProps = {
    name: "version"
};

const AppDeveloperSection = props => {
    return (
        <FormSection name={props.name}>
            <Field
                name="developerName"
                autoFocus
                component={formUtils.renderTextField}
                label="Developer Name *"
            />
            <br />
            <Field
                name="developerEmail"
                component={formUtils.renderTextField}
                label="Developer Email"
            />
            <br />
            <Field
                name="developerOrg"
                component={formUtils.renderTextField}
                label="Organisation *"
            />
        </FormSection>
    );
};

AppDeveloperSection.propTypes = {
    name: PropTypes.string
};

AppDeveloperSection.defaultProps = {
    name: "developer"
};

const AppImageSection = props => {
    return (
        <FormSection name={props.name}>
            <p>
                You can upload additional images and set preview image once your
                app has been uploaded.
            </p>
            <Field
                name="image"
                component={formUtils.renderUploadField}
                accept="image/*"
                hintText="Upload logo"
                validate={validateImageFile}
                id="imageFile"
            />
            <br />
            <Field
                name="imageCaption"
                component={formUtils.renderTextField}
                label="Image caption"
            />
            <br />
            <Field
                name="imageDescription"
                component={formUtils.renderTextField}
                label="Image description"
            />
            <br />
        </FormSection>
    );
};

AppImageSection.propTypes = {
    name: PropTypes.string
};

AppImageSection.defaultProps = {
    name: "image"
};

class UploadAppFormStepper extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Get the values from redux-form when submitted (after validation)
     * The values are structured according to the FormSection-names and their
     * respective Fields.
     *
     * Calls this.props.submitted(), with data from the form converted to
     * a format the api understands.
     * @param values
     */
    onSubmit(values) {
        const data = {
            name: values.general.appName,
            description: values.general.description,
            appType: values.general.appType,
            sourceUrl: values.general.sourceUrl,
            developer: {
                name: values.developer.developerName,
                email: values.developer.developerEmail,
                address: values.developer.developerAddress || "",
                organisation: values.developer.developerOrg
            },
            versions: [
                {
                    version: values.version.version,
                    minDhisVersion: values.version.minVer,
                    maxDhisVersion: values.version.maxVer,
                    demoUrl: values.version.demoUrl
                }
            ],
            images: [
                {
                    caption: values.image ? values.image.imageCaption : "",
                    description: values.image
                        ? values.image.imageDescription
                        : ""
                }
            ]
        };
        const imageFile =
            values.image && values.image.image ? values.image.image[0] : [];
        data.images = imageFile.length > 0 ? data.images : [];
        const appFile = values.version.file[0];

        this.props.submitted({ data, file: appFile, image: imageFile });
    }

    render() {
        return (
            <FormStepper
                form="uploadAppForm"
                onSubmit={this.onSubmit.bind(this)}
                validate={validate}
                sections={[
                    <AppGeneralSection name="general" />,
                    <AppVersionSection name="version" />,
                    <AppDeveloperSection name="developer" />,
                    <AppImageSection name="image" />
                ]}
                initialValues={{ general: { appType: appTypes[0].value } }}
            />
        );
    }
}
UploadAppFormStepper.propTypes = {
    submitted: PropTypes.func.isRequired,
    form: PropTypes.string.isRequired
};

UploadAppFormStepper.defaultProps = {};

export default UploadAppFormStepper;
