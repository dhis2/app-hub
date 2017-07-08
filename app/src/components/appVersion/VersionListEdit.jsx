import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import Theme from '../../styles/theme';


const TableIcon = ({children}) => (<FontIcon style={{fontSize: '18px'}}
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
    }

    handleOpenEditField(e) {
        console.log("open editfield!")
        this.setState({
            ...this.state,
            open: !this.state.open,
            anchorEl: e.currentTarget,
        })
    }

    handleEditField(version) {

        this.setState({
            ...this.state,
            editingFields: [...this.state.editingFields, version.id]
        });
    }

    handleSubmitField(version) {
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
        const submitIcon = (<IconButton onTouchTap={() => this.handleSubmitField(version)}>
            <TableIcon>check</TableIcon></IconButton>)

        return (
            <TableRow key={version.id}>
                <TableRowColumn style={{width: '48px'}}>
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
                <TableRowColumn style={{width: "auto"}}>{submitIcon}
                    <IconButton style={{width: '18dp'}} onTouchTap={() => this.props.handleDelete(version)}><TableIcon>delete</TableIcon></IconButton></TableRowColumn>

            </TableRow>
        )
    }

    renderRowNormal(version) {
        const editIcon = (<IconButton onTouchTap={() => this.handleEditField(version)}>
            <TableIcon>edit</TableIcon></IconButton>)

        return (
            <TableRow key={version.id}>
                <TableRowColumn style={{width: '48px'}}>
                    <a href={version.downloadUrl} title="Download">
                        <TableIcon>file_download</TableIcon>
                    </a>
                </TableRowColumn>
                <TableRowColumn>
                    {version.demoUrl ?
                        <a href={`${version.demoUrl}`} target="_blank" style={{color: Theme.palette.primary1Color}}>Demo</a>
                        : 'N/A'}</TableRowColumn>
                <TableRowColumn onTouchTap={this.handleOpenEditField.bind(this)}>{version.version}</TableRowColumn>
                <TableRowColumn>{version.minDhisVersion}</TableRowColumn>
                <TableRowColumn>{version.maxDhisVersion}</TableRowColumn>
                <TableRowColumn title={new Date(version.created).toLocaleString()}>
                    {new Date(version.created).toLocaleDateString()}</TableRowColumn>
                <TableRowColumn style={{width: "48px"}}>{editIcon}</TableRowColumn>

            </TableRow>
        )
    }


    render() {
        const styles = {
            tableHeaderColumn: {
                paddingLeft: '24px',
                paddingRight: '24px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        }
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
                        <TableHeaderColumn style={{...styles.tableHeaderColumn, width: '48px'}} tooltip='Download link'>Download</TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn} tooltip='Demo link'>Demo</TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn}
                                           tooltip='Version of app'>Version</TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn}
                                           tooltip='Minimum DHIS version that this version supports'>Min DHIS
                            version</TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn}
                                           tooltip='Maximum DHIS version that this version supports'>Max DHIS
                            version</TableHeaderColumn>
                        <TableHeaderColumn style={styles.tableHeaderColumn} tooltip='The date the version was uploaded'>Uploaded</TableHeaderColumn>
                        <TableHeaderColumn style={{...styles.tableHeaderColumn, width: "48px"}}></TableHeaderColumn>
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
    editable: PropTypes.bool,
    handleDelete: PropTypes.func,
    handleEdit: PropTypes.func,
}
VersionListEdit.defaultProps = {
    editable: false
}

export default VersionListEdit;
