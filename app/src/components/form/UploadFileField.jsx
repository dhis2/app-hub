import React, {PropTypes, Component} from 'react'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FAB from 'material-ui/FloatingActionButton';


const uploadIconPosition = PropTypes.oneOf(['right', 'left']);


class UploadFileField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileName: ''
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
        const {renderAdd, renderRemove, uploadIconPosition, ...props} = this.props;
        const groupStyle = {
            display: 'flex',
            alignItems: 'center',
        }
        const fieldStyle = {
            marginLeft: uploadIconPosition === 'left' ? '10px' : 0,
            marginRight: uploadIconPosition === 'right' ? '10px' : 0,
        }
        const removeButton = (<IconButton iconClassName="material-icons"
                                          onClick={this.props.handleRemoveField}>remove</IconButton>)
        const addButton = (<IconButton iconClassName="material-icons"
                                       onClick={this.props.handleAddField}>add</IconButton>)

        const uploadButton = (<FAB mini onClick={this.uploadAction}><FontIcon
            className="material-icons">file_upload</FontIcon></FAB>)
        return (
            <div>
                <div style={groupStyle}>
                    {uploadIconPosition === 'left' ? uploadButton : null}
                    <TextField name={this.props.id} style={fieldStyle} readOnly hintText={props.hintText} value={this.state.fileName}
                               onClick={this.uploadAction}/>
                    <input type="file" style={{display: 'none'}} ref={(ref) => this.fileInput = ref}
                           onChange={this.handleUpload}/>
                    {uploadIconPosition === 'right' ? uploadButton : null}
                    {renderRemove ? removeButton : null}
                    {renderAdd ? addButton : null}
                </div>
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
    hintText: PropTypes.string,
    id: PropTypes.string,
    uploadIconPosition: uploadIconPosition,
}

UploadFileField.defaultProps = {
    renderAdd: false,
    renderRemove: false,
    uploadIconPosition: 'right'
}

export default UploadFileField;