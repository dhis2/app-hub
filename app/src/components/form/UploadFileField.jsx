import React, {PropTypes, Component} from 'react'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FAB from 'material-ui/FloatingActionButton';


const groupStyle = {
    display: 'flex',
    alignItems: 'center',
}

class UploadFileField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileName: props.defaultText || ''
        }
        this.uploadAction = this.uploadAction.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    uploadAction(e) {
        this.fileInput.click(e);
    }

    handleUpload(e) {
        const file = e.target.files[0];
        this.setState({
            ...this.state,
            fileName: file.name
        })
        console.log(file)
        this.props.handleUpload(file);
    }

    render() {

        return (
            <div style={groupStyle}>
                <FAB mini onClick={this.uploadAction}><FontIcon
                    className="material-icons">file_upload</FontIcon></FAB>
                <TextField name={this.props.id} style={{marginLeft: '5px'}} readOnly value={this.state.fileName}
                           onClick={this.uploadAction} />
                <input type="file" style={{display: 'none'}} ref={(ref) => this.fileInput = ref}
                       onChange={this.handleUpload}/>
                {this.props.renderRemove ? <IconButton iconClassName="material-icons"
                                                       onClick={this.props.handleRemoveField}>remove</IconButton> : null}
                {this.props.renderAdd ? <IconButton iconClassName="material-icons"
                                                    onClick={this.props.handleAddField}>add</IconButton> : null}
            </div>
        )
    }
}

UploadFileField.propTypes = {
    renderAdd: PropTypes.bool,
    renderRemove: PropTypes.bool,
    handleUpload: PropTypes.func.isRequired,
    handleRemoveField: PropTypes.func,
    handleAddField: PropTypes.func,
    defaultText: PropTypes.string,
    id: PropTypes.string
}

UploadFileField.defaultProps = {
    renderAdd: false,
    renderRemove: false,
}

export default UploadFileField;