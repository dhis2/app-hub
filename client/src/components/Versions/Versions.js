import PropTypes from 'prop-types'
import { useState } from 'react'
import semver from 'semver'
import Filters from './Filters/Filters'
import styles from './Versions.module.css'
import VersionsTable from './VersionsTable/VersionsTable'
import config from 'config'

const { defaultAppChannel, appChannelToDisplayName } = config.ui

const initialChannelsFilter = versions => {
    const hasChannel = (versions, channel) =>
        versions.find(v => v.channel === channel)

    if (hasChannel(versions, defaultAppChannel)) {
        return new Set([defaultAppChannel])
    }
    return new Set(
        Object.keys(appChannelToDisplayName).filter(channel =>
            hasChannel(versions, channel)
        )
    )
}

const Versions = ({ versions, renderDeleteVersionButton }) => {
    const [channelsFilter, setChannelsFilter] = useState(() =>
        initialChannelsFilter(versions)
    )
    const [dhisVersionFilter, setDhisVersionFilter] = useState('')
    const dhisVersionFilterSemver = semver.coerce(dhisVersionFilter)
    const satisfiesDhisVersion = ({
        minDhisVersion: min,
        maxDhisVersion: max,
    }) => {
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
        .filter(({ channel }) => channelsFilter.has(channel))
        .filter(satisfiesDhisVersion)

    return (
        <div className={styles.versionsContainer}>
            <Filters
                versions={versions}
                channelsFilter={channelsFilter}
                setChannelsFilter={setChannelsFilter}
                dhisVersionFilter={dhisVersionFilter}
                setDhisVersionFilter={setDhisVersionFilter}
            />
            {filteredVersions.length > 0 ? (
                <VersionsTable
                    versions={filteredVersions}
                    renderDeleteVersionButton={renderDeleteVersionButton}
                />
            ) : (
                <em className={styles.noVersions}>
                    There are no compatible versions matching your criteria
                </em>
            )}
        </div>
    )
}

Versions.propTypes = {
    versions: PropTypes.array.isRequired,
    renderDeleteVersionButton: PropTypes.func,
}

export default Versions
