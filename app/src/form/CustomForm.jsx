import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import CustomFormField from './CustomFormField';

export default class CustomForm extends Component {
    //TODO: Probably need state of fields here
    //That way we can loop through and force validation on fields,
    //and return the form state this way
    constructor(props) {
        super(props);
        const fields = {};
        React.Children.map(props.children, field => {
            const { name, validator } = field.props
            fields[name] = {
                name,
                errorTextMessage: '',
                valid: false,
                value: '',
                validator: validator || null

            }
        });
        this.state = {
            fields: fields
        }
    }

    validate(e) {

    }

    fieldOnChange(name, value, validResult) {
        console.log(name +" val " + value.target.value)
        const field = this.state.fields[name];
        if(field) {
            field.validator(value)
        }
        if(fields[name] !== 'undefined' && (fields[name] !== validResult)) {
            console.log("update")
            this.setState({
                ...this.state,
                fields: {
                    ...this.state.fields,
                    [name]: validResult
                }
            });
        }
    }

    fieldOnBlur(name, value) {

    }

    render() {
        const {children} = this.props;
        const fields = React.Children.map(children, child => {
            const { name, errorTextMessage, valid, value, validator, ...rest } = child.props;
            const onChange = child.props.onChange ? this.fieldOnChange.bind(this, name) : null;
            const childProps = {...rest, onChange, name, onFieldChange: this.fieldOnChange.bind(this)}
            return React.createElement(child.type, childProps)

        })

        return (<div>
                {fields}
            </div>
        )
    }

}

CustomForm.defaultProps = {

}

CustomForm.propTypes = {
    children: PropTypes.node,
    validated: PropTypes.func
}