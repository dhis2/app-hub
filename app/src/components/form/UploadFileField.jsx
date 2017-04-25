import React, {PropTypes, Component} from 'react'
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import FAB from 'material-ui/FloatingActionButton';


const uploadIconPosition = PropTypes.oneOf(['right', 'left']);


/**
 * A Controlled field for uploading files.
 * Supports multiple files in one input field.
 * Note that the file themselves are not recorded in state,
 * only the fileName to be shown in the input field.
 *
 * You can get the files in the Callback-function props handleUpload(files),
 * once a file has been selected.
 *
 */
class UploadFileField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileName: ''
        }
        this.uploadAction = this.uploadAction.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleResetFile = this.handleResetFile.bind(this);
    }

    /**
     * Used handle upload-action on a hidden input-field
     * which is used hold the files. We use a regular textfield
     * to show the selected files.
     */
    uploadAction(e) {
        this.fileInput.click(e);
    }

    /**
     * Updates the state with the fileName in the controlled inputs,
     * and calls the props handleUpload()
     * with the array of Files in the input field.
     *
     * Called when a file is selected through the input-field.
     * Supports multiple files in one field, so we return
     * the values (File) in an array.
     * @param e {input field}
     */
    handleUpload(e) {
        const files = e.target.files;
        if(files.length < 1) {
            this.handleResetFile();
            return;
        }
        const fileArray = Object.keys(files).map((key, i) => (files[key]));
        const fileNames = fileArray.reduce((acc, elem, currInd) => {
            const seperator = currInd !== fileArray.length -1 ?  ', ' : '';
            return acc + elem.name + seperator}
            , '');
        this.setState({
            ...this.state,
            fileName: fileNames
        })
        this.props.handleUpload(fileArray);
    }

    handleResetFile() {
        this.setState({
            ...this.state,
            fileName: '',
        })
        this.props.handleUpload('');
    }

    render() {
        const {renderAdd, renderRemove, uploadIconPosition, value, ...props} = this.props;
        const groupStyle = {
            display: 'flex',
            alignItems: 'center',
        }
        const fieldStyle = {
            marginLeft: uploadIconPosition === 'left' ? '10px' : 0,
            marginRight: uploadIconPosition === 'right' ? '10px' : 0,
        }
        console.log(value)
        const removeButton = (<IconButton iconClassName="material-icons"
                                          onClick={() => {this.handleResetFile(); this.props.handleRemoveField()}}>remove</IconButton>)
        const addButton = (<IconButton iconClassName="material-icons"
                                       onClick={this.props.handleAddField}>add</IconButton>)

        const uploadButton = (<FAB mini onClick={this.uploadAction}><FontIcon
            className="material-icons">file_upload</FontIcon></FAB>)

        const fileArray = Object.keys(value).map((key, i) => (value[key]));
        const fileNames = fileArray.reduce((acc, elem, currInd) => {
                const seperator = currInd !== fileArray.length -1 ?  ', ' : '';
                return acc + elem.name + seperator}
            , '');

        return (
            <div style={groupStyle}>
                {uploadIconPosition === 'left' ? uploadButton : null}
                <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                    <TextField name={this.props.id} style={fieldStyle} readOnly hintText={props.hintText}
                               errorText={props.errorText}
                               value={fileNames}
                               onClick={this.uploadAction}/>
                    {fileNames ? <IconButton style={{position: 'absolute', right: '0px'}} onClick={this.handleResetFile.bind(this)}>
                        <FontIcon className="material-icons">clear</FontIcon>
                    </IconButton> : null}
                </div>
                <input type="file"  multiple={this.props.multiple} style={{display: 'none'}} ref={(ref) => this.fileInput = ref}
                       onChange={this.handleUpload}/>
                {uploadIconPosition === 'right' ? uploadButton : null}
                {renderRemove ? removeButton : null}
                {renderAdd ? addButton : null}
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
    multiple: PropTypes.bool,
}

UploadFileField.defaultProps = {
    renderAdd: false,
    renderRemove: false,
    uploadIconPosition: 'right',
    multiple: false,
}

export default UploadFileField;