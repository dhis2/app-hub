import React, {PropTypes, Component} from 'react'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FAB from 'material-ui/FloatingActionButton';
import UploadFileField from './UploadFileField';

class MultipleUploadFileFields extends Component {
    constructor(props) {
        super(props);

        this.handleAddField = this.handleAddField.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.state = {
            fields: [0],
            count: 1,
        }

    }

    handleUpload(file) {
        if (this.props.upload) {
            this.props.upload(file);
        }

    }

    handleRemoveField(index) {
        this.setState({
            ...this.state,
            fields: this.state.fields.filter((id) => id !== index)
        });
    }

    handleAddField(e) {

        this.setState({
                ...this.state,
                count: this.state.count + 1,
                fields: [...this.state.fields, this.state.count + 1]
            }
        )
    }

    render() {
        const fields = this.state.fields.map((id, i) => {
            return (<UploadFileField
                renderAdd={(this.props.multiLastOnly && i == this.state.fields.length - 1) || !this.props.multiLastOnly}
                handleAddField={this.handleAddField}
                renderRemove={this.state.fields.length > 1}
                handleRemoveField={this.handleRemoveField.bind(this, id)}
                key={id}
                id={''+id}
                handleUpload={this.handleUpload}/>)
        })
        return (
            <div>
                {fields}
            </div>
        )
    }

}

MultipleUploadFileFields.propTypes = {
    multiLastOnly: PropTypes.bool,
    upload: PropTypes.func,
}

MultipleUploadFileFields.defaultProps = {
    multiLastOnly: true,

}
export default MultipleUploadFileFields;