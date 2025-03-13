import { Button, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useMemo, useEffect } from 'react'
import { laggySWRMiddleware } from '../../api/utils'
import Filters from './Filters/Filters'
import styles from './Versions.module.css'
import VersionsTable from './VersionsTable/VersionsTable'
import config from 'config'
import { usePagination, useQuery } from 'src/api'

const { defaultAppChannel } = config.ui

const useChannels = (appId) => {
    const [availableChannels, setAvailableChannels] = useState([
        defaultAppChannel,
    ])
    const [channelsFilter, setChannelsFilter] = useState(
        new Set([defaultAppChannel])
    )
    const { data, error } = useQuery(`apps/${appId}/channels`)

    useEffect(() => {
        if (data) {
            setAvailableChannels(data)

            // if default-channel is not present, set to available-channels
            if (!data.includes(defaultAppChannel)) {
                setChannelsFilter(new Set(data))
            }
        }

        if (error) {
            // in this case it should be enough to just log it, and fallback to default-channel
            console.error('Failed to get channels', error.message)
        }
    }, [data])

    return { availableChannels, channelsFilter, setChannelsFilter }
}

const Versions = ({
    appId,
    renderDeleteVersionButton,
    showDownloadCount,
    changelogData,
}) => {
    const { availableChannels, channelsFilter, setChannelsFilter } =
        useChannels(appId)

    const [dhisVersionFilter, setDhisVersionFilter] = useState('-1')
    const params = useMemo(
        () => ({
            pageSize: 5,
            minDhisVersion:
                dhisVersionFilter != '-1'
                    ? `lte:${dhisVersionFilter}`
                    : undefined,
            maxDhisVersion:
                dhisVersionFilter != '-1'
                    ? `gte:${dhisVersionFilter}`
                    : undefined,
            channel: Array.from(channelsFilter).join(),
        }),
        [dhisVersionFilter, Array.from(channelsFilter).join()]
    )

    const {
        data,
        error,
        setSize,
        size,
        isAtEnd,
        isLoadingInitial,
        isValidating,
    } = usePagination(`apps/${appId}/versions`, params, {
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
        <div>
            <Filters
                availableChannels={availableChannels}
                channelsFilter={channelsFilter}
                setChannelsFilter={setChannelsFilter}
                dhisVersionFilter={dhisVersionFilter}
                setDhisVersionFilter={setDhisVersionFilter}
            />
            {versions.length > 0 ? (
                <VersionsTable
                    versions={versions}
                    renderDeleteVersionButton={renderDeleteVersionButton}
                    showDownloadCount={showDownloadCount}
                    appId={appId}
                    changelogData={changelogData}
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
                        loading={isValidating}
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
