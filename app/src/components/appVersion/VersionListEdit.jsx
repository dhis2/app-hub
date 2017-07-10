import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import Theme from '../../styles/theme';



const styles = {
    tableHeaderColumn: {
        paddingLeft: '24px',
        paddingRight: '24px',
    },
    columnText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    editColumn: {},
    firstColumn: {},
    iconButton: {
        padding: '8px',
        width: '36px',
        height: '36px'
    },
    fontIcon: {
        fontSize: '18px',
    }

}


const TableIcon = ({children}) => (<FontIcon style={styles.fontIcon}
                                             className="material-icons">{children}</FontIcon>)

class VersionListEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            anchorEl: null,
            editingFields: [],
            editedValues: {}

        }

        this.renderRowEdit = this.renderRowEdit.bind(this);
        this.renderRowNormal = this.renderRowNormal.bind(this);
        this.handleCancelRow = this.handleCancelRow.bind(this);
    }

    handleOpenEditField(e) {
        this.setState({
            ...this.state,
            open: !this.state.open,
            anchorEl: e.currentTarget,
        })
    }

    handleCloseEditField(e) {
        this.setState({
            ...this.state,
            open: !this.state.open,
            anchorEl: null,
        })
    }

    handleEditRow(version) {

        this.setState({
            ...this.state,
            editingFields: [...this.state.editingFields, version.id]
        });
    }

    handleCancelRow(version) {
        this.setState({
            ...this.state,
            editingFields: this.state.editingFields.filter(v => v !== version.id),
        });
    }

    handleSubmitRow(version) {
        this.setState({
            ...this.state,
            editingFields: this.state.editingFields.filter(v => v !== version.id),
        });
        const newVersion = {
            ...this.state.editedValues[version.id]
        }
        const mergedVers = {...version, ...newVersion};


        this.props.handleEdit(mergedVers);
    }

    /**
     * Generic onChange-handler of TextFields to update the state according to value of textField
     * @param versionId of version being edited
     * @param fieldName of field being edited, should be the same as the name in store
     * @param e event fired from TextField
     * @param newValue from TextField
     */
    handleValueChange(versionId, fieldName, e, newValue) {
        const editedValues = this.state.editedValues;
        this.setState({
            ...this.state,
            editedValues: {
                ...editedValues,
                [versionId]: {
                    [fieldName]: newValue
                }
            }
        })
    }

    renderRowEdit(version) {
        const submitIcon = (<IconButton style={styles.iconButton} onTouchTap={() => this.handleSubmitRow(version)}>
            <TableIcon>check</TableIcon></IconButton>);

        const cancelIcon = (<IconButton style={styles.iconButton} onTouchTap={() => this.handleCancelRow(version)}>
            <TableIcon>clear</TableIcon></IconButton>);

        return (
            <TableRow key={version.id}>
                <TableRowColumn style={styles.firstColumn}>
                    <a href={version.downloadUrl} title="Download">
                        <TableIcon>file_download</TableIcon>
                    </a>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField defaultValue={version.demoUrl}
                               onChange={this.handleValueChange.bind(this, version.id, 'demoUrl')}
                               name="demoUrl"/>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField defaultValue={version.version}
                               onChange={this.handleValueChange.bind(this, version.id, 'version')}
                               name="version"/>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField defaultValue={version.minDhisVersion}
                               onChange={this.handleValueChange.bind(this, version.id, 'minDhisVersion')}
                               name="minDhisVersion"/>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField defaultValue={version.maxDhisVersion}
                               onChange={this.handleValueChange.bind(this, version.id, 'maxDhisVersion')}
                               name="maxDhisVersion"/>
                </TableRowColumn>
                <TableRowColumn title={new Date(version.created).toLocaleString()}>
                    {new Date(version.created).toLocaleDateString()}</TableRowColumn>
                <TableRowColumn style={styles.editColumn}>
                    {submitIcon}
                    {cancelIcon}
                </TableRowColumn>

            </TableRow>
        )
    }

    renderRowNormal(version) {
        const editIcon = (<IconButton style={styles.iconButton} onTouchTap={() => this.handleEditRow(version)}>
            <TableIcon>edit</TableIcon></IconButton>)
        const deleteIcon = (<IconButton style={styles.iconButton} onTouchTap={() => this.props.handleDelete(version)}>
            <TableIcon>delete</TableIcon>
        </IconButton>)
        return (
            <TableRow key={version.id}>
                <TableRowColumn style={styles.firstColumn}>
                    <a href={version.downloadUrl} title="Download">
                        <TableIcon>file_download</TableIcon>
                    </a>
                </TableRowColumn>
                <TableRowColumn>
                    {version.demoUrl ?
                        <a href={`${version.demoUrl}`} target="_blank"
                           style={{color: Theme.palette.primary1Color}}>Demo</a>
                        : 'N/A'}</TableRowColumn>
                <TableRowColumn onTouchTap={this.handleOpenEditField.bind(this)}>{version.version}</TableRowColumn>
                <TableRowColumn>{version.minDhisVersion}</TableRowColumn>
                <TableRowColumn>{version.maxDhisVersion}</TableRowColumn>
                <TableRowColumn title={new Date(version.created).toLocaleString()}>
                    {new Date(version.created).toLocaleDateString()}</TableRowColumn>
                <TableRowColumn style={styles.editColumn}>
                    {editIcon}
                    {deleteIcon}
                </TableRowColumn>
            </TableRow>
        )
    }


    render() {

        const props = this.props;
        const versions = props.versionList.sort((a, b) => b.created - a.created).map((version, i) => {
            return (
                this.state.editingFields.indexOf(version.id) > -1 ? this.renderRowEdit(version) : this.renderRowNormal(version)
            )
        })

        return (
            <Table selectable={false}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{...styles.tableHeaderColumn, ...styles.firstColumn}}
                                           tooltip='Download link'>
                            <div style={styles.columnText}>Download</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn} tooltip='Demo link'>
                            <div style={styles.columnText}>Demo</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn}
                                           tooltip='Version of app'>
                            <div style={styles.columnText}>Version</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn}
                                           tooltip='Minimum DHIS version that this version supports'>
                            <div style={styles.columnText}>Min DHIS version</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn}
                                           tooltip='Maximum DHIS version that this version supports'>
                            <div style={styles.columnText}>Max DHIS version</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn} tooltip='The date the version was uploaded'>
                            <div style={styles.columnText}>Uploaded</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={{...styles.tableHeaderColumn, ...styles.editColumn}}></TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {versions}
                </TableBody>
            </Table>
        )
    }
}

VersionListEdit.propTypes = {
    versionList: PropTypes.array.isRequired,
    handleDelete: PropTypes.func,
    handleEdit: PropTypes.func,
}
VersionListEdit.defaultProps = {
}

export default VersionListEdit;
