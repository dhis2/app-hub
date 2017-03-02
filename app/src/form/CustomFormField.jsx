import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
export default class CustomFormField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorText: '',
            valid: false,
            value: props.defaultValue ? props.defaultValue : '' ,
        }

        this.requiredValidator = this.requiredValidator.bind(this);
    }

    requiredValidator(value) {
        if(!value && value.length < 1) {
            return false;
        }

        return true;
    }

    handleChange(e) {
        const value = e.target.value;
        let valid = false;
        const validator = this.props.validator;
        if(validator) {
            valid = validator(value);
        }
        if(valid && this.props.required) {
            valid = this.requiredValidator(value);
        }
        if(valid) {
            this.setState({
                ...this.state,
                value,
                valid,
                errorText: ''
            });
        } else {
            this.setState({
                ...this.state,
                value,
                valid,
                errorText: this.props.errorTextMessage
            })
        }

        this.props.onFieldChange(this.props.name, value, valid)
    }

    render() {
        const { name, required, validator, defaultValue, errorTextMessage, onFieldChange, ...rest} = this.props;
        const { errorText } = this.state;
        console.log(this.props)
        console.log(this.state)
        console.log(errorText)
        return (<TextField
            name={name}
            errorText={errorText}
            value={this.state.value}
            required
            onChange={this.handleChange.bind(this)}
            {...rest}
        />)
    }

}

CustomFormField.defaultProps = {
    required: false,
    errorTextMessage: "Field is required.",

}

CustomFormField.propTypes = {
    name: PropTypes.string.isRequired,
    errorText: PropTypes.string,
    validator: PropTypes.func,
    required: PropTypes.bool,
    defaultValue: PropTypes.string

}