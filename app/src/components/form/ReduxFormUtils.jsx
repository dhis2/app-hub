import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import React from 'react';

export const renderTextField = ({input, label, meta: {touched, error}, ...props}) => (
    <TextField hintText={label}
               floatingLabelText={label}
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

export const renderToggle = ({input, changedCB, label, meta: {touched, error}, ...props}) => (
    <Toggle
        label={label}
        onToggle={(e, toggled) => {
            input.onChange(toggled);
            changedCB ? changedCB(toggled) : () => {
                }
        }}
        toggled={input.value ? true : false}
        {...input}
        {...props}
    />
)