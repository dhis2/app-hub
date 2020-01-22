import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'
import FontIcon from 'material-ui/FontIcon'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import TextField from 'material-ui/TextField'
import Theme from '../../styles/theme'
import SelectField from 'material-ui/SelectField'

import merge from 'lodash/fp/merge'

import config from '../../../config'

import ErrorOrLoading from '../utils/ErrorOrLoading'

import { loadChannels } from '../../actions/actionCreators'

const styles = {
    tableHeaderColumn: {
        paddingLeft: '12px',
        paddingRight: '12px',
    },
    columnText: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    editColumn: {
        paddingLeft: '12px',
        paddingRight: '12px',
    },
    firstColumn: {
        paddingLeft: '12px',
        paddingRight: '12px',
    },
    tableRowColumn: {
        paddingLeft: '12px',
        paddingRight: '12px',
    },
    iconButton: {
        padding: '8px',
        width: '36px',
        height: '36px',
    },
    fontIcon: {
        fontSize: '18px',
    },
}

const TableIcon = ({ children }) => (
    <FontIcon style={styles.fontIcon} className="material-icons">
        {children}
    </FontIcon>
)

class VersionListEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            anchorEl: null,
            editingFields: [],
            editedValues: {},
        }

        this.renderRow = this.renderRow.bind(this)
        this.handleCancelRow = this.handleCancelRow.bind(this)
    }

    componentDidMount() {
        this.props.loadChannels()
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
            editingFields: [...this.state.editingFields, version.id],
        })
    }

    handleCancelRow(version) {
        this.setState({
            ...this.state,
            editingFields: this.state.editingFields.filter(
                v => v !== version.id
            ),
        })
    }

    handleSubmitRow(version) {
        this.setState({
            ...this.state,
            editingFields: this.state.editingFields.filter(
                v => v !== version.id
            ),
        })
        const newVersion = {
            ...this.state.editedValues[version.id],
        }
        const mergedVers = { ...version, ...newVersion }

        this.props.handleEdit(mergedVers)
    }

    /**
     * Generic onChange-handler of TextFields to update the state according to value of textField
     * @param versionId of version being edited
     * @param fieldName of field being edited, should be the same as the name in store
     * @param e event fired from TextField
     * @param newValue from TextField
     */
    //eslint-disable-next-line max-params
    handleValueChange(versionId, fieldName, e, newValue) {
        const editedValues = this.state.editedValues
        this.setState({
            editedValues: merge(editedValues, {
                [versionId]: { [fieldName]: newValue },
            }),
        })
    }

    handleChannelChange(versionId, e, selectedIndex) {
        const editedValues = this.state.editedValues
        this.setState({
            editedValues: merge(editedValues, {
                [versionId]: {
                    channel: this.props.channels.list[selectedIndex].name,
                },
            }),
        })
    }

    renderRow(version, edit) {
        const editIcon = (
            <IconButton
                key="edit"
                style={styles.iconButton}
                onTouchTap={() => this.handleEditRow(version)}
            >
                <TableIcon>edit</TableIcon>
            </IconButton>
        )
        const submitIcon = (
            <IconButton
                key="submit"
                style={styles.iconButton}
                onTouchTap={() => this.handleSubmitRow(version)}
            >
                <TableIcon>check</TableIcon>
            </IconButton>
        )

        const cancelIcon = (
            <IconButton
                key="cancel"
                style={styles.iconButton}
                onTouchTap={() => this.handleCancelRow(version)}
            >
                <TableIcon>clear</TableIcon>
            </IconButton>
        )

        const deleteIcon = (
            <IconButton
                key="delete"
                style={styles.iconButton}
                onTouchTap={() => this.props.handleDelete(version)}
            >
                <TableIcon>delete</TableIcon>
            </IconButton>
        )

        const DHISReleaseChannels = this.props.channels.list.map(channel => (
            <MenuItem
                key={'channel_' + channel.name}
                value={channel.name}
                primaryText={channel.name}
            />
        ))

        const editingIcons = [submitIcon, cancelIcon]
        const normalIcons = [editIcon, deleteIcon]

        const values = merge(version, this.state.editedValues[version.id])

        //TODO: add error instead of passing false to ErrorOrLoading
        return (
            <TableRow key={version.id}>
                <TableRowColumn style={styles.firstColumn}>
                    <a href={values.downloadUrl} title="Download">
                        <TableIcon>file_download</TableIcon>
                    </a>
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {edit ? (
                        <TextField
                            defaultValue={version.demoUrl}
                            onChange={this.handleValueChange.bind(
                                this,
                                version.id,
                                'demoUrl'
                            )}
                            name="demoUrl"
                        />
                    ) : values.demoUrl ? (
                        <a
                            href={`${values.demoUrl}`}
                            target="_blank"
                            style={{ color: Theme.palette.primary1Color }}
                        >
                            Demo
                        </a>
                    ) : (
                        'N/A'
                    )}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {edit ? (
                        <TextField
                            defaultValue={values.version}
                            onChange={this.handleValueChange.bind(
                                this,
                                version.id,
                                'version'
                            )}
                            name="version"
                        />
                    ) : (
                        values.version
                    )}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {edit ? (
                        <TextField
                            defaultValue={values.minDhisVersion}
                            onChange={this.handleValueChange.bind(
                                this,
                                version.id,
                                'minDhisVersion'
                            )}
                            name="minDhisVersion"
                        />
                    ) : (
                        values.minDhisVersion
                    )}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {edit ? (
                        <TextField
                            defaultValue={values.maxDhisVersion}
                            onChange={this.handleValueChange.bind(
                                this,
                                version.id,
                                'maxDhisVersion'
                            )}
                            name="maxDhisVersion"
                        />
                    ) : (
                        values.maxDhisVersion
                    )}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {edit && !this.props.channels.loading ? (
                        <SelectField
                            value={values.channel}
                            onChange={this.handleChannelChange.bind(
                                this,
                                version.id
                            )}
                            name="channel"
                        >
                            {DHISReleaseChannels}
                        </SelectField>
                    ) : edit && this.props.channels.loading ? (
                        <ErrorOrLoading
                            loading={this.props.channels.loading}
                            error={false}
                        />
                    ) : (
                        version.channel
                    )}
                </TableRowColumn>
                <TableRowColumn
                    style={styles.tableRowColumn}
                    title={new Date(version.created).toLocaleString()}
                >
                    {new Date(version.created).toLocaleDateString()}
                </TableRowColumn>
                <TableRowColumn style={styles.editColumn}>
                    {edit ? editingIcons : normalIcons}
                </TableRowColumn>
            </TableRow>
        )
    }

    render() {
        const props = this.props

        const versions = props.versionList
            .sort((a, b) => b.created - a.created)
            .map((version, i) => {
                const editingRow =
                    this.state.editingFields.indexOf(version.id) > -1

                return this.renderRow(version, editingRow)
            })

        return (
            <Table selectable={false}>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn
                            style={{
                                ...styles.tableHeaderColumn,
                                ...styles.firstColumn,
                            }}
                            tooltip="Download link"
                        >
                            <div style={styles.columnText}>Download</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={styles.tableHeaderColumn}
                            tooltip="Demo link"
                        >
                            <div style={styles.columnText}>Demo</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={styles.tableHeaderColumn}
                            tooltip="Version of app"
                        >
                            <div style={styles.columnText}>Version</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={styles.tableHeaderColumn}
                            tooltip="Minimum DHIS version that this version supports"
                        >
                            <div style={styles.columnText}>
                                Min DHIS version
                            </div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={styles.tableHeaderColumn}
                            tooltip="Maximum DHIS version that this version supports"
                        >
                            <div style={styles.columnText}>
                                Max DHIS version
                            </div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={styles.tableHeaderColumn}
                            tooltip="Release channel to publish this app to"
                        >
                            <div style={styles.columnText}>Channel</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={styles.tableHeaderColumn}
                            tooltip="The date the version was uploaded"
                        >
                            <div style={styles.columnText}>Uploaded</div>
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            style={{
                                ...styles.tableHeaderColumn,
                                ...styles.editColumn,
                            }}
                        />
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>{versions}</TableBody>
            </Table>
        )
    }
}

VersionListEdit.propTypes = {
    versionList: PropTypes.array.isRequired,
    handleDelete: PropTypes.func,
    handleEdit: PropTypes.func,
}
VersionListEdit.defaultProps = {}

const mapStateToProps = state => ({
    channels: state.channels,
})

const mapDispatchToProps = dispatch => ({
    loadChannels() {
        dispatch(loadChannels())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(VersionListEdit)
