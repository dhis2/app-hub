import React from 'react'
import PropTypes from 'prop-types'
import AutoComplete from 'material-ui/AutoComplete'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import SelectField from 'material-ui/SelectField'
import UploadFileField from './UploadFileField'
import Toggle from 'material-ui/Toggle'
import _size from 'lodash/size'
import _keys from 'lodash/keys'
import semverValid from 'semver/functions/valid'
import semverClean from 'semver/functions/clean'
import Theme from '../../styles/theme'
import { Field } from 'redux-form'

const floatingLabelStyle = {
    color: Theme.palette.textHeaderColor,
}

export const renderTextField = ({
    input,
    label,
    helpText,
    hintText,
    forceShowErrors,
    meta: { touched, error },
    ...props
}) => {
    const showHelpText = !forceShowErrors && (!error || !touched) && helpText
    const helpTextStyle = {
        position: 'relative',
        fontSize: '12px',
        lineHeight: '12px',
        color: Theme.palette.textHeaderColor,
        bottom: '1px',
        marginBottom: '16px',
        width: props.fullWidth ? '100%' : '256px',
    }

    return (
        <div>
            <TextField
                floatingLabelStyle={floatingLabelStyle}
                floatingLabelFixed={true}
                floatingLabelText={label}
                hintText={hintText || label}
                errorText={(touched || forceShowErrors) && error}
                {...input}
                {...props}
            />
            {showHelpText && <div style={helpTextStyle}>{helpText}</div>}
        </div>
    )
}

export const renderTextFieldWithHelpText = ({ props, ...rest }) => (
    <renderTextField errorStyle={{ color: 'rgba(0, 0, 0, 0.3)' }} {...props} />
)

export const renderUploadField = ({
    input,
    hintText,
    label,
    forceShowErrors,
    meta: { touched, error, dirty },
    formMeta,
    children,
    ...props
}) => {
    return (
        <UploadFileField
            hintText={hintText || label}
            label={label}
            handleUpload={files => {
                input.onChange(files)
            }}
            errorText={
                ((formMeta && formMeta.submitFailed) ||
                    touched ||
                    forceShowErrors) &&
                error
            }
            {...input}
            {...props}
        />
    )
}

export const renderTextFieldWithClearButton = ({
    input,
    label,
    forceShowErrors,
    meta: { touched, error },
    ...props
}) => {
    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <TextField
                hintText={label}
                floatingLabelText={label}
                floatingLabelStyle={floatingLabelStyle}
                errorText={(touched || forceShowErrors) && error}
                {...input}
                {...props}
            />
            {input.value ? (
                <IconButton
                    style={{ position: 'absolute', right: '-5px' }}
                    onClick={() => input.onChange('')}
                >
                    <FontIcon className="material-icons">clear</FontIcon>
                </IconButton>
            ) : null}
        </div>
    )
}

export const renderAutoCompleteField = ({
    input,
    label,
    forceShowErrors,
    meta: { touched, error },
    ...props
}) => (
    <AutoComplete
        hintText={label}
        floatingLabelText={label}
        errorText={(touched || forceShowErrors) && error}
        {...input}
        {...props}
    />
)

export const renderSelectField = ({
    input,
    label,
    hintText,
    forceShowErrors,
    meta: { touched, error },
    children,
    ...props
}) => {
    return (
        <SelectField
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText={label}
            floatingLabelFixed
            hintText={hintText}
            errorText={(touched || forceShowErrors) && error}
            {...input}
            onFocus={() => {}} //prevent reset of value when tabbing + enter
            onBlur={() => {}}
            onChange={(event, index, value) => input.onChange(value)}
            {...props}
            children={children}
        />
    )
}

export const renderToggle = ({
    input,
    changedCB,
    onToggle,
    label,
    meta: { touched, error },
    ...props
}) => (
    <Toggle
        label={label}
        onToggle={(e, toggled) => {
            input.onChange(toggled)
            onToggle ? onToggle(toggled) : () => {}
        }}
        toggled={input.value ? true : false}
        {...input}
        {...props}
    />
)

export const validateUploadField = (
    supportedExtensions = [],
    required = false
) => (value, allValues, props) => {
    let error = undefined

    const maxSize = 25 * 2 ** 20 //25mb
    if (!value || !Array.isArray(value)) {
        return error
    }
    if (Array.isArray(value) && value.length < 1 && required) {
        return 'Required'
    }

    value.forEach((file, i) => {
        const fileExtension =
            file.name && file.name.substring(file.name.lastIndexOf('.'))

        if (
            !file.type ||
            (fileExtension && !supportedExtensions.includes(fileExtension))
        ) {
            error = (
                <span>
                    Invalid filetype.
                    <br />
                    Supported extensions: {supportedExtensions.join(', ')}
                </span>
            )
        }

        if (file.size && file.size > maxSize) {
            error = `File limit: ${maxSize / 2 ** 20} MB`
        }
    })
    return error
}

export const validateZipFile = validateUploadField(['.zip'], true)
export const validateImageFile = validateUploadField(['.png', '.jpg', '.jpeg'])

const urlRegex = /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i

export const validateURL = value => {
    let error = undefined

    if (value && !urlRegex.test(value)) {
        error = 'Invalid URL'
    }

    return error
}

/**
 * Check if the object is an redux-form error, i.e has any keys with values.
 * @param errors object to check if contains errors.
 */

export const hasError = errors =>
    _keys(errors).find(key => _size(errors[key]) > 0) !== undefined

const SemanticVersionHelpText = () => {
    return (
        <div>
            Version number must use semantic versioning with format x.x.x (e.g.
            2.3.1).
            <br />
            <a
                href="https://docs.npmjs.com/about-semantic-versioning"
                target="_blank"
                className={'link'}
            >
                Read more about semantic versioning
            </a>
            .
        </div>
    )
}

export const validateVersion = version => {
    if (version && semverValid(version) == null) {
        return <SemanticVersionHelpText />
    }
    return undefined
}

// Alias so we can render with JSX
const TextFieldRF = renderTextField

/**
 * Wraps TextField with Version-specific props
 * @param {} props forwarded to textfield-component
 */
export const VersionField = (props) => {
    return (
        <TextFieldRF
            label="Version *"
            helpText={<SemanticVersionHelpText />}
            {...props}
            onBlur={event => {
                const { value } = event.target
                const semverStr = semverClean(value, {
                    loose: true,
                    includePrerelease: true,
                })
                if (semverStr) {
                    event.preventDefault()
                    props.input.onBlur(semverStr)
                } else {
                    props.input.onBlur(event)
                }
            }}
        />
    )
}
