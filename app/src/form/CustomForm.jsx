import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import CustomFormField from './CustomFormField';

export default class CustomForm extends Component {
    constructor(props) {
        super(props);
        const fields = {};
        React.Children.map(props.children, field => {
            const { name } = field.props
            fields[name] = false
        });
        this.state = {
            fields: fields
        }
    }

    validate(e) {

    }

    fieldOnChange(name, value, validResult) {
        const fields = this.state.fields;
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
            const childProps = {onFieldChange: this.fieldOnChange.bind(this)}
            return React.cloneElement(child, childProps)

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