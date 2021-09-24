import { Button, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useMemo } from 'react'
import { laggySWRMiddleware } from '../../api/utils'
import Filters from './Filters/Filters'
import styles from './Versions.module.css'
import VersionsTable from './VersionsTable/VersionsTable'
import config from 'config'
import { usePagination } from 'src/api'
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

const Versions = ({ appId, renderDeleteVersionButton }) => {
    const [channelsFilter, setChannelsFilter] = useState(
        new Set([defaultAppChannel])
    )
    const [dhisVersionFilter, setDhisVersionFilter] = useState('')
    const params = useMemo(
        () => ({
            pageSize: 5,
            minDhisVersion: dhisVersionFilter
                ? `lte:${dhisVersionFilter}`
                : undefined,
            maxDhisVersion: dhisVersionFilter
                ? `gte:${dhisVersionFilter}`
                : undefined,
            channel: Array.from(channelsFilter).join(),
        }),
        [dhisVersionFilter, channelsFilter]
    )

    const { data, error, setSize, size, isAtEnd, isLoadingInitial } =
        usePagination(`apps/${appId}/versions`, params, {
            swr: {
                use: [laggySWRMiddleware], // keep previous results when changing filters
            },
        })

    const versions = data ?? []

    if (error) {
        return (
            <NoticeBox title={'Error loading versions'} error>
                {error.message}
            </NoticeBox>
        )
    }

    if (isLoadingInitial) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <div className={styles.versionsContainer}>
            <Filters
                versions={versions}
                channelsFilter={channelsFilter}
                setChannelsFilter={setChannelsFilter}
                dhisVersionFilter={dhisVersionFilter}
                setDhisVersionFilter={setDhisVersionFilter}
            />
            {versions.length > 0 ? (
                <VersionsTable
                    versions={versions}
                    renderDeleteVersionButton={renderDeleteVersionButton}
                />
            ) : (
                <em className={styles.noVersions}>
                    No versions found. Try adjusting your search.
                </em>
            )}
            {!isAtEnd && (
                <div className={styles.loadMore}>
                    <Button
                        onClick={() => {
                            setSize(size + 1)
                        }}
                        disabled={isLoadingInitial}
                    >
                        Load more
                    </Button>
                </div>
            )}
        </div>
    )
}

Versions.propTypes = {
    appId: PropTypes.string.isRequired,
    renderDeleteVersionButton: PropTypes.func,
}

export default Versions
