import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import UploadFileField from './UploadFileField';
import Toggle from 'material-ui/Toggle';
import React from 'react';

export const renderTextField = ({input, label, meta: {touched, error}, ...props}) => (
    <TextField hintText={label}
               floatingLabelText={label}
               errorText={touched && error}
               {...input}
               {...props}
    />
)

export const renderUploadField = ({input, label, meta: {touched, error}, children, ...props}) => (
    <UploadFileField hintText={label}
                     handleUpload={(file) => { input.onChange(file);}}
                     errorText={touched && error}
                     {...input}
                     {...props}
                      />
)

export const renderTextFieldWithClearButton = ({input, label, meta: {touched, error}, ...props}) => {

    return (
        <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <TextField hintText={label}
                       floatingLabelText={label}
                       errorText={touched && error}
                       {...input}
                       {...props} />
            {input.value ?<IconButton style={{position: 'absolute', right: '-5px'}} onClick={() => input.onChange('')}>
                <FontIcon className="material-icons">clear</FontIcon>
            </IconButton> : null}
        </div>
    )
}

export const renderAutoCompleteField = ({input, label, meta: {touched, error}, ...props}) => (
    <AutoComplete hintText={label}
                  floatingLabelText={label}
                  errorText={touched && error}
                  {...input}
                  {...props}
    />
)

export const renderSelectField = ({input, label, meta: {touched, error}, children}) => {
    return (
        <SelectField
            floatingLabelText={label}
            errorText={touched && error}
            {...input}
            onFocus={() => {}} //prevent reset of value when tabbing + enter
            onBlur={() => {}}
            onChange={(event, index, value) => input.onChange(value)}
            children={children}/>
    )
}

export const renderToggle = ({input, changedCB, onToggle, label, meta: {touched, error}, ...props}) => (
    <Toggle
        label={label}


        onToggle={(e, toggled) => {
            input.onChange(toggled);
            onToggle ? onToggle(toggled) : () => {
                }
        }}
        toggled={input.value ? true : false}
        {...input}  
        {...props}  

    />
)