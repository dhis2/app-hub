import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {Field, Form, FieldArray, reduxForm} from 'redux-form';
import * as formUtils from './ReduxFormUtils';
import UploadFileField from './UploadFileField';

class UploadFieldsArray extends Component {

    constructor(props) {
        super(props);
        this.handleAddField = this.handleAddField.bind(this);
        // this.handleRemoveField = this.handleRemoveField.bind(this);
        // this.handleUploadField = this.handleUploadField.bind(this);
    }


    componentWillMount() {
        this.handleAddField("")
    }

    handleRemoveField(index) {
        const {array} = this.props;
        array.remove('uploads', index);
    }

    handleAddField(value) {
        if (!value || typeof value !== 'string') {
            value = "";
        }
        const {array} = this.props;
        // const fieldIndex = Object.keys(this.props.fieldsState.values).length;
        array.push("uploads", value);
    }


    handleUploadField(index, e, fileArray) {
        console.log(fileArray);
        const currFieldName = this.props.fieldPrefix + index;
        // this.props.change(currFieldName,fileArray[index]);
        if (fileArray.length > 1) {
            const currFieldName = this.props.fieldPrefix + index;
            // this.props.change(currFieldName,fileArray[index]);
            for (let i = index + 1; i < fileArray.length; i++) {
                console.log("adding")
                this.handleAddField(fileArray[i]);
            }
        }

    }


    render() {
        const {fields, multiple, multipleSplit, multiLastOnly} = this.props;
        return (
            <div>
                {fields.map((field, i) => (
                    <Field
                        name={`${field}.${i}`}
                        component={formUtils.renderUploadField}
                        renderAdd={(multiLastOnly && i == fields.length - 1) || !multiLastOnly}
                        handleAddField={this.handleAddField}
                        renderRemove={fields.length > 1}
                        multiple={multiple}
                        handleRemoveField={this.handleRemoveField.bind(this, i)}
                        onChange={this.handleUploadField.bind(this, i)}
                        key={i}
                        id={'' + i}
                    />)
                )}
            </div>
        )
    }
}

UploadFieldsArray.propTypes = {
    multipleSplit: PropTypes.bool,
}


class MultipleUploadFileFields extends Component {

    constructor(props) {
        super(props);

    }

    onSubmit(values) {
        //transform object of fields to array
        const arr = Object.keys(values).map((key, ind) => {
            return values[key];
        })
        return this.props.submitted(arr);
    }


    render() {
        const {handleSubmit, pristine, submitting, fieldsState, ...props} = this.props;
        if (!fieldsState) return null;

        return (
            <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <FieldArray name="uploads" component={UploadFieldsArray} {...props}/>
            </Form>
        )
    }
}

MultipleUploadFileFields.propTypes = {
    //Only render "+" button if its the last field to render.
    multiLastOnly: PropTypes.bool,
    //If fields should accept multiple files
    multipleField: PropTypes.bool,
    //Should we split multiple files into new fields?
    multipleSplit: PropTypes.bool,
    submitted: PropTypes.func.isRequired,
    //override default name of redux-form
    form: PropTypes.string,
}

MultipleUploadFileFields.defaultProps = {
    multiLastOnly: true,
    multiple: true,
    //name of the form in the redux-store
    form: 'multipleUploadForm',
    fieldPrefix: 'upload'

}

const ReduxFormConnected = reduxForm({
    form: MultipleUploadFileFields.defaultProps.form,
})(MultipleUploadFileFields);
export default ReduxFormConnected;