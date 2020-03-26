import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
    Field,
    Form,
    FieldArray,
    reduxForm,
    defaultShouldValidate,
} from 'redux-form'
import * as formUtils from './ReduxFormUtils'
import { validateImageFile } from './ReduxFormUtils'
import Button from 'material-ui/RaisedButton'
import Spinner from '../utils/Spinner'
import FontIcon from 'material-ui/FontIcon'

class UploadFieldsArray extends Component {
    constructor(props) {
        super(props)
    }

    handleRemoveField(index) {
        const { fields } = this.props
        fields.remove(index)
    }

    handleAddField(value) {
        if (!value) {
            value = []
        }
        if (!Array.isArray(value)) {
            value = [value]
        }
        const { fields } = this.props
        fields.push({ files: value })
    }

    /**
     * This function is called after a change has occurred to a field,
     * but before value has been saved to the store.
     * We therefore add fields if props.multipleSplit is true, and
     * split the files into these fields.
     * @param value - An Array of Files
     * @param name
     * @returns {*}
     */
    parseSplitFilesIntoFields(value, name) {
        if (!value) return value

        if (!Array.isArray(value)) {
            value = [value]
        }
        const currFieldVal = value.slice(0, 1)
        if (value.length > 1) {
            const { fields } = this.props
            for (let i = 1; i < value.length && i < this.props.maxImages; i++) {
                fields.push({ files: value.slice(i, i + 1) })
            }
        }
        return currFieldVal
    }

    render() {
        const {
            fields,
            meta,
            multiple,
            multipleSplit,
            multiLastOnly,
            fieldValidate,
            ...rest
        } = this.props
        const error = meta.error
        return (
            <div>
                {fields.map((field, i) => {
                    const name = `${field}.files`
                    return (
                        <Field
                            name={name}
                            key={i}
                            component={formUtils.renderUploadField}
                            renderAdd={
                                (!error &&
                                    multiLastOnly &&
                                    i == fields.length - 1) ||
                                !multiLastOnly
                            }
                            handleAddField={this.handleAddField.bind(this)}
                            renderRemove={fields.length > 1}
                            multiple={multiple}
                            validate={fieldValidate}
                            parse={
                                !error && multiple && multipleSplit
                                    ? this.parseSplitFilesIntoFields.bind(this)
                                    : null
                            }
                            value={fields.get(i).files}
                            formMeta={meta}
                            handleRemoveField={this.handleRemoveField.bind(
                                this,
                                i
                            )}
                            {...rest}
                        />
                    )
                })}
                {error ? <span>{error}</span> : null}
            </div>
        )
    }
}

UploadFieldsArray.propTypes = {
    multipleSplit: PropTypes.bool,
    maxImages: PropTypes.number,
}

/**
 * This uses redux-form
 * See more on api here
 * http://redux-form.com/6.8.0/docs/api/
 *
 */

const validateArr = (value, allValues, props) => {
    if (!value) return undefined
    if (value.length >= props.maxImages) {
        return <span style={{ color: 'rgb(244, 67, 54)' }}>Max 10 images</span>
    }
    return undefined
}

class MultipleUploadFileFields extends Component {
    constructor(props) {
        super(props)
    }

    onSubmit(values) {
        const prefix = this.props.fieldPrefix
        const fileArrays = values[prefix]

        let mergedArr = fileArrays.reduce((a, b) => {
            if (a.files) {
                a = a.files
            }
            if (b.files) {
                b = b.files
            }
            return a.concat(b)
        })
        //Only one file, return this
        if (mergedArr.files) mergedArr = mergedArr.files
        return this.props.submitted(mergedArr)
    }

    render() {
        const { handleSubmit, pristine, submitting, ...props } = this.props
        const fieldArrayProps = {
            multiLastOnly: props.multiLastOnly,
            multiple: props.multiple,
            multipleSplit: props.multipleSplit,
            accept: props.accept,
            maxImages: props.maxImages,
            fieldPrefix: props.fieldPrefix,
            fieldValidate: props.validateUploadField || validateImageFile,
            supportedExtensions: props.supportedExtensions,
        }
        const uploadButtonProps = {
            icon: submitting ? (
                <Spinner inButton />
            ) : (
                <FontIcon className="material-icons">file_upload</FontIcon>
            ),
            label: !submitting ? 'Upload' : null,
            style: {
                marginTop: '20px',
            },
        }
        return (
            <Form
                onSubmit={handleSubmit(this.onSubmit.bind(this))}
                style={{ margin: '0 0 15px 0' }}
            >
                <FieldArray
                    name={this.props.fieldPrefix}
                    component={UploadFieldsArray}
                    {...fieldArrayProps}
                    validate={validateArr}
                />

                <Button
                    type="submit"
                    primary
                    disabled={pristine || submitting}
                    {...uploadButtonProps}
                />
            </Form>
        )
    }
}

const validateForm = values => {
    const errors = {}
    if (!values.uploads || !values.uploads.length) {
        errors.uploads = { _error: 'At least one file must be entered.' }
    } else {
        const uploadsArrayErrors = []
        values.uploads.forEach((uploadField, i) => {
            const uploadErrors = {}
            if (
                !uploadField ||
                !uploadField.files ||
                uploadField.files.length < 1
            ) {
                uploadErrors.files = 'Required'
                uploadsArrayErrors[i] = uploadErrors
            }
            uploadsArrayErrors[i] = uploadErrors
        })
        if (uploadsArrayErrors.length) {
            errors.uploads = uploadsArrayErrors
        }
    }
    return errors
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
    fieldPrefix: PropTypes.string,
    //Function run validation on FieldArray-level
    //See 'http://redux-form.com/6.8.0/docs/api/FieldArray.md/' validate prop
    validate: PropTypes.func,
    //Function to run validation on field-level
    validateField: PropTypes.func,
    maxImages: PropTypes.number,
    supportedExtensions: PropTypes.array,
}

MultipleUploadFileFields.defaultProps = {
    multiLastOnly: true,
    multiple: true,
    multipleSplit: true,
    //name of the form in the redux-store
    form: 'multipleUploadForm',
    fieldPrefix: 'uploads',
    maxImages: 10,
    accept: 'image/*',
    supportedExtensions: ['.png', '.jpg', '.jpeg'],
}

const ReduxFormConnected = reduxForm({
    form: MultipleUploadFileFields.defaultProps.form,
    touchOnChange: true,
    initialValues: { uploads: [{ files: [] }] },
    ...MultipleUploadFileFields.defaultProps,
    validate: validateForm,
    shouldValidate: params =>
        defaultShouldValidate(params) && !params.props.submitting,
})(MultipleUploadFileFields)
export default ReduxFormConnected
