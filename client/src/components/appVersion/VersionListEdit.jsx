// eslint-disable-next-line react/no-deprecated
import { useAuth0 } from '@auth0/auth0-react'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'
import PropTypes from 'prop-types'
import React, { Component, useState, useEffect } from 'react'

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
    hasError: {
        color: '#f00',
    },
}

const TableIcon = ({ children }) => (
    <FontIcon style={styles.fontIcon} className="material-icons">
        {children}
    </FontIcon>
)
TableIcon.propTypes = {
    children: PropTypes.array,
}

const DownloadLinkWithToken = ({ downloadUrl }) => {
    const [token, setToken] = useState(null)
    const { getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        const getToken = async () => {
            const token = await getAccessTokenSilently()
            setToken(token)
        }
        getToken()
    }, [getAccessTokenSilently])

    //as we use hapi-auth-jwt2 in the backend, it allows us to pass the JWT in the querystring
    const downloadUrlWithToken = `${downloadUrl}?token=${token}`

    return (
        <a href={downloadUrlWithToken} title="Download">
            <TableIcon>file_download</TableIcon>
        </a>
    )
}

DownloadLinkWithToken.propTypes = {
    downloadUrl: PropTypes.string.isRequired,
}

class VersionListEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
            anchorEl: null,
        }

        this.renderRow = this.renderRow.bind(this)
    }

    handleEditRow(version) {
        this.props.handleEdit(version)
    }

    renderRow(appVersion) {
        const editIcon = (
            <IconButton
                key="edit"
                style={styles.iconButton}
                onClick={() => this.handleEditRow(appVersion)}
            >
                <TableIcon>edit</TableIcon>
            </IconButton>
        )

        const deleteIcon = (
            <IconButton
                key="delete"
                style={styles.iconButton}
                onClick={() => this.props.handleDelete(appVersion)}
            >
                <TableIcon>delete</TableIcon>
            </IconButton>
        )

        const editIcons = [editIcon, deleteIcon]
        const {
            demoUrl,
            downloadUrl,
            version,
            minDhisVersion,
            maxDhisVersion,
            channel,
            created,
        } = appVersion

        return (
            <TableRow key={version.id}>
                <TableRowColumn style={styles.firstColumn}>
                    <DownloadLinkWithToken downloadUrl={downloadUrl} />
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {demoUrl || 'N/A'}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {version}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {minDhisVersion}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {maxDhisVersion}
                </TableRowColumn>
                <TableRowColumn style={styles.tableRowColumn}>
                    {channel}
                </TableRowColumn>
                <TableRowColumn
                    style={styles.tableRowColumn}
                    title={new Date(created).toLocaleString()}
                >
                    {new Date(created).toLocaleDateString()}
                </TableRowColumn>
                <TableRowColumn style={styles.editColumn}>
                    {editIcons}
                </TableRowColumn>
            </TableRow>
        )
    }

    render() {
        const { versionList } = this.props

        const versions = versionList
            .sort((a, b) => b.created - a.created)
            .map(version => this.renderRow(version))

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
    handleDelete: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    versionList: PropTypes.array.isRequired,
}
VersionListEdit.defaultProps = {}

export default VersionListEdit
