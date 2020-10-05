import PropTypes from 'prop-types'
import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import TextField from 'material-ui/TextField'
import FAB from 'material-ui/FloatingActionButton'
import Theme from '../../styles/theme'

const uploadIconPosition = PropTypes.oneOf(['right', 'left'])

/**
 * A helper for uploading files through redux-form.
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
        super(props)

        this.uploadAction = this.uploadAction.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
        this.handleResetFile = this.handleResetFile.bind(this)
    }

    /**
     * Used to handle upload-action on a hidden input-field
     * which is used hold the files. We use a regular textfield
     * to show the selected files.
     */
    uploadAction(e) {
        this.fileInput.click(e)
    }

    /**
     * Calls the props handleUpload()
     * with the array of Files in the input field.
     *
     * Called when a file is selected through the input-field.
     * Supports multiple files in one field, so we return
     * the values (File) in an array.
     * @param e {input field}
     */
    handleUpload(e) {
        const files = e.target.files

        if (files.length < 1) {
            this.handleResetFile()
            return
        }

        const fileArray = [...files]
        this.props.handleUpload(fileArray)
    }

    handleResetFile() {
        this.props.handleUpload([])
        this.fileInput.value = ''
    }

    render() {
        const {
            renderAdd,
            renderRemove,
            uploadIconPosition,
            value,
            ...props
        } = this.props

        const styles = {
            outerDiv: {
                display: 'flex',
                alignItems: 'center',
            },
            field: {
                marginTop: 5,
                marginLeft: uploadIconPosition === 'left' ? '10px' : 0,
                marginRight: uploadIconPosition === 'right' ? '10px' : 0,
            },
            resetButton: {
                position: 'absolute',
                right: '0px',
            },
            fieldDiv: {
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
            },
        }

        const removeButton = (
            <IconButton
                iconClassName="material-icons"
                onClick={() => {
                    this.handleResetFile()
                    this.props.handleRemoveField()
                }}
            >
                remove
            </IconButton>
        )
        const addButton = (
            <IconButton
                iconClassName="material-icons"
                onClick={() => this.props.handleAddField()}
            >
                add
            </IconButton>
        )

        const uploadButton = (
            <FAB mini onClick={this.uploadAction}>
                <FontIcon className="material-icons">file_upload</FontIcon>
            </FAB>
        )

        let textFieldOutput = ''
        if (typeof value === 'string') {
            textFieldOutput = value
        } else if (Array.isArray(value)) {
            const fileNames = value.reduce((acc, elem, currInd) => {
                const seperator = currInd !== value.length - 1 ? ', ' : ''
                return acc + elem.name + seperator
            }, '')
            textFieldOutput = fileNames
        } else if (typeof value === 'File') {
            textFieldOutput = value.name
        }

        return (
            <div style={{ ...styles.outerDiv, ...props.style }}>
                {uploadIconPosition === 'left' ? uploadButton : null}

                <div style={styles.fieldDiv}>
                    <TextField
                        name={this.props.name}
                        style={styles.field}
                        readOnly
                        floatingLabelText={props.label}
                        floatingLabelFixed
                        floatingLabelStyle={{
                            color: Theme.palette.textHeaderColor,
                        }}
                        hintText={props.hintText}
                        errorText={props.errorText}
                        value={textFieldOutput}
                        onClick={this.uploadAction}
                    />
                    {textFieldOutput ? (
                        <IconButton
                            style={styles.resetButton}
                            onClick={this.handleResetFile.bind(this)}
                        >
                            <FontIcon className="material-icons">
                                clear
                            </FontIcon>
                        </IconButton>
                    ) : null}
                </div>

                <input
                    type="file"
                    multiple={this.props.multiple}
                    style={{ display: 'none' }}
                    ref={ref => (this.fileInput = ref)}
                    onChange={this.handleUpload}
                    accept={this.props.accept || ''}
                />

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
    initalFiles: PropTypes.array,
    //Filetypes to accept
    accept: PropTypes.string,
}

UploadFileField.defaultProps = {
    renderAdd: false,
    renderRemove: false,
    uploadIconPosition: 'right',
    multiple: false,
}

export default UploadFileField
