import { useAuth0 } from '@auth0/auth0-react'
import {
    Button,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import styles from './VersionsTable.module.css'
import config from 'config'
import { renderDhisVersionsCompatibility } from 'src/lib/render-dhis-versions-compatibility'

const { appChannelToDisplayName } = config.ui

const useCreateGetDownloadUrl = (url) => {
    const [token, setToken] = useState()
    const { getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        const getToken = async () => {
            const token = await getAccessTokenSilently()
            setToken(token)
        }
        getToken()
    }, [url, getAccessTokenSilently])

    return useCallback(
        (url) => (token ? url.concat(`?token=${token}`) : url),
        [token]
    )
}

const VersionsTable = ({
    versions,
    renderDeleteVersionButton,
    showDownloadCount,
}) => {
    const getDownloadUrl = useCreateGetDownloadUrl()

    return (
        <Table className={styles.table}>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>Version</TableCellHead>
                    <TableCellHead>Channel</TableCellHead>
                    <TableCellHead>DHIS2 version compatibility</TableCellHead>
                    <TableCellHead>Upload date</TableCellHead>
                    {showDownloadCount && (
                        <TableCellHead>Downloads</TableCellHead>
                    )}
                    <TableCellHead></TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
                {versions.map((version) => (
                    <TableRow key={version.id}>
                        <TableCell>{version.version}</TableCell>
                        <TableCell className={styles.channelNameCell}>
                            {appChannelToDisplayName[version.channel]}
                        </TableCell>
                        <TableCell>
                            {renderDhisVersionsCompatibility(
                                version.minDhisVersion,
                                version.maxDhisVersion
                            )}
                        </TableCell>
                        <TableCell>
                            <span title={new Date(version.createdAt)}>
                                {new Date(
                                    version.createdAt
                                ).toLocaleDateString()}
                            </span>
                        </TableCell>
                        {showDownloadCount && (
                            <TableCell>
                                <span>{version.downloadCount}</span>
                            </TableCell>
                        )}
                        <TableCell>
                            <a
                                download
                                href={getDownloadUrl(version.downloadUrl)}
                                tabIndex="-1"
                            >
                                <Button small secondary>
                                    Download
                                </Button>
                            </a>
                            {renderDeleteVersionButton &&
                                renderDeleteVersionButton(version)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
VersionsTable.propTypes = {
    versions: PropTypes.array.isRequired,
    renderDeleteVersionButton: PropTypes.func,
}

export default VersionsTable
