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
    SingleSelectOption,
} from '@dhis2/ui-core'
import { SingleSelectField } from '@dhis2/ui-widgets/build/es/SingleSelectField/SingleSelectField'
import React, { useState } from 'react'
import config from 'config'
import semver from 'semver'
import styles from './Versions.module.css'
import { renderDhisVersionsCompatibility } from 'src/lib/render-dhis-versions-compatibility'

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
                dense
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

const Filters = ({
    versions,
    channelsFilter,
    setChannelsFilter,
    dhisVersionFilter,
    setDhisVersionFilter,
    dhisVersions,
}) => {
    const hasChannel = channel => versions.some(v => v.channel === channel)

    return (
        <div className={styles.versionsFilters}>
            <h3 className={styles.subheader}>Channel</h3>
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
            <div className={styles.dhisVersionSelect}>
                <SingleSelectField
                    dense
                    placeholder={'Select a version'}
                    label={'Compatible with DHIS2 version'}
                    clearable
                    selected={dhisVersionFilter}
                    onChange={({ selected }) => setDhisVersionFilter(selected)}
                >
                    {dhisVersions.map(dhisVersion => (
                        <SingleSelectOption
                            key={dhisVersion}
                            label={dhisVersion}
                            value={dhisVersion}
                        />
                    ))}
                </SingleSelectField>
            </div>
        </div>
    )
}

Filters.propTypes = {
    channelsFilter: PropTypes.object.isRequired,
    dhisVersionFilter: PropTypes.string.isRequired,
    dhisVersions: PropTypes.array.isRequired,
    setChannelsFilter: PropTypes.func.isRequired,
    setDhisVersionFilter: PropTypes.func.isRequired,
    versions: PropTypes.array.isRequired,
}

const VersionsTable = ({ versions }) => (
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
                        {renderDhisVersionsCompatibility(
                            version.minDhisVersion,
                            version.maxDhisVersion
                        )}
                    </TableCell>
                    <TableCell>
                        {new Date(version.created).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        <a download href={version.downloadUrl} tabIndex="-1">
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
}

const Versions = ({ versions }) => {
    let initialChannelsFilter = new Set(['stable'])
    if (!versions.find(v => v.channel === 'stable')) {
        if (versions.find(v => v.channel === 'development')) {
            initialChannelsFilter = new Set(['development'])
        } else {
            initialChannelsFilter = new Set(['canary'])
        }
    }
    const [channelsFilter, setChannelsFilter] = useState(initialChannelsFilter)
    const [dhisVersionFilter, setDhisVersionFilter] = useState('')
    const dhisVersionFilterSemver = semver.coerce(dhisVersionFilter)
    const satisfiesDhisVersion = version => {
        const { minDhisVersion: min, maxDhisVersion: max } = version
        if (!dhisVersionFilter || (!min && !max)) {
            return true
        } else if (min && max) {
            const range = new semver.Range(`${min} - ${max}`)
            return semver.satisfies(dhisVersionFilterSemver, range)
        } else if (!min && max) {
            const range = new semver.Range(`<=${max}`)
            return semver.satisfies(dhisVersionFilterSemver, range)
        } else if (min && !max) {
            const range = new semver.Range(`>=${min}`)
            return semver.satisfies(dhisVersionFilterSemver, range)
        }
    }
    const filteredVersions = versions
        .filter(version => channelsFilter.has(version.channel))
        .filter(satisfiesDhisVersion)

    return (
        <div className={styles.versionsContainer}>
            <Filters
                versions={versions}
                dhisVersions={config.ui.dhisVersions}
                channelsFilter={channelsFilter}
                setChannelsFilter={setChannelsFilter}
                dhisVersionFilter={dhisVersionFilter}
                setDhisVersionFilter={setDhisVersionFilter}
            />
            {filteredVersions.length > 0 ? (
                <VersionsTable versions={filteredVersions} />
            ) : (
                <em>There are no compatible versions matching your criteria</em>
            )}
        </div>
    )
}

Versions.propTypes = {
    versions: PropTypes.array.isRequired,
}

export default Versions
