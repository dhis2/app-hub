import PropTypes from 'prop-types'
import {
    Checkbox,
    Button,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui-core'
import React, { useState } from 'react'
import semver from 'semver'
import styles from './Versions.module.css'
import config from 'config'

const channelToDisplayName = config.ui.appChannelToDisplayName

const ChannelCheckbox = ({
    name,
    label,
    channelsFilter,
    setChannelsFilter,
}) => {
    const handleChange = ({ checked }) => {
        const newState = new Set(channelsFilter)
        if (checked) {
            newState.add(name)
        } else {
            newState.delete(name)
        }
        setChannelsFilter(newState)
    }

    return (
        <div className={styles.channelCheckbox}>
            <Checkbox
                checked={channelsFilter.has(name)}
                disabled={channelsFilter.size === 1 && channelsFilter.has(name)}
                onChange={handleChange}
                label={label}
            />
        </div>
    )
}

ChannelCheckbox.propTypes = {
    channelsFilter: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    setChannelsFilter: PropTypes.func.isRequired,
}

const Filters = ({ versions, channelsFilter, setChannelsFilter }) => {
    const hasChannel = channel => versions.some(v => v.channel === channel)

    return (
        <div className={styles.versionsFilters}>
            <h3 className={styles.subheader}>
                Channel
            </h3>
            {Object.keys(channelToDisplayName)
                .filter(hasChannel)
                .map(name => (
                    <ChannelCheckbox
                        key={name}
                        name={name}
                        label={channelToDisplayName[name]}
                        channelsFilter={channelsFilter}
                        setChannelsFilter={setChannelsFilter}
                    />
                ))}
        </div>
    )
}

Filters.propTypes = {
    channelsFilter: PropTypes.object.isRequired,
    setChannelsFilter: PropTypes.func.isRequired,
    versions: PropTypes.array.isRequired,
}

const renderDhisVersionsCompatibility = (min, max) => {
    if (min && max) {
        return `${min}–${max}`
    } else if (min && !max) {
        return `${min} and above`
    } else if (!min && max) {
        return `${max} and below`
    }
    return null
}

const VersionsTable = ({ installedVersion, versions }) => (
    <Table>
        <TableHead>
            <TableRowHead>
                <TableCellHead>Version</TableCellHead>
                <TableCellHead>Channel</TableCellHead>
                <TableCellHead>DHIS2 version compatibility</TableCellHead>
                <TableCellHead>Upload date</TableCellHead>
                <TableCellHead></TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
            {versions.map(version => (
                <TableRow key={version.id}>
                    <TableCell>{version.version}</TableCell>
                    <TableCell className={styles.channelNameCell}>
                        {channelToDisplayName[version.channel]}
                    </TableCell>
                    <TableCell>
                        {renderDhisVersionsCompatibility(version.minDhisVersion, version.maxDhisVersion)}
                    </TableCell>
                    <TableCell>{(new Date(version.created)).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <a download href={version.downloadUrl}>
                            <Button small secondary>
                                Download
                            </Button>
                        </a>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

VersionsTable.propTypes = {
    versions: PropTypes.array.isRequired,
    installedVersion: PropTypes.string,
}

const Versions = ({ installedVersion, versions }) => {
    const [channelsFilter, setChannelsFilter] = useState(new Set(['stable']))
    const filteredVersions = versions.filter(version => channelsFilter.has(version.channel))

    return (
        <div className={styles.versionsContainer}>
            <Filters
                versions={versions}
                channelsFilter={channelsFilter}
                setChannelsFilter={setChannelsFilter}
            />
            {filteredVersions.length > 0 ? (
                <VersionsTable
                    installedVersion={installedVersion}
                    versions={filteredVersions}
                />
            ) : (
                <em>There are no compatible versions matching your criteria</em>
            )}
        </div>
    )
}

Versions.propTypes = {
    versions: PropTypes.array.isRequired,
    installedVersion: PropTypes.string,
}

export default Versions
