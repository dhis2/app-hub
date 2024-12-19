import { Button, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useMemo, useEffect } from 'react'
import { laggySWRMiddleware } from '../../api/utils'
import Filters from './Filters/Filters'
import styles from './Versions.module.css'
import VersionsTable from './VersionsTable/VersionsTable'
import config from 'config'
import { usePagination, useQuery } from 'src/api'
import ChangeLogViewer from './ChangeLogViewer'

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
    hasChangelog,
}) => {
    const { availableChannels, channelsFilter, setChannelsFilter } =
        useChannels(appId)

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

    const [changelogVisible, setChangelogVisible] = useState(false)
    const showChangeLog = () => {
        setChangelogVisible(!changelogVisible)
    }

    const onCloseChangelog = () => {
        setChangelogVisible(false)
    }

    const [compareVersion, setCompareVersion] = useState()
    const [baseVersion, setBaseVersion] = useState(versions?.[0]?.version)

    const changeBaseVersion = (version) => {
        setBaseVersion(version)
        setCompareVersion()
    }

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
                availableChannels={availableChannels}
                channelsFilter={channelsFilter}
                setChannelsFilter={setChannelsFilter}
                dhisVersionFilter={dhisVersionFilter}
                setDhisVersionFilter={setDhisVersionFilter}
                showChangeLog={showChangeLog}
                hasChangelog={hasChangelog}
            />
            {versions.length > 0 ? (
                <VersionsTable
                    versions={versions}
                    renderDeleteVersionButton={renderDeleteVersionButton}
                    showDownloadCount={showDownloadCount}
                    appId={appId}
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
            {changelogVisible && (
                <ChangeLogViewer
                    appId={appId}
                    onCloseChangelog={onCloseChangelog}
                    baseVersion={baseVersion ?? versions?.[0]?.version}
                    setCompareVersion={setCompareVersion}
                    setBaseVersion={changeBaseVersion}
                    compareVersion={compareVersion}
                />
            )}
        </div>
    )
}

Versions.propTypes = {
    appId: PropTypes.string.isRequired,
    renderDeleteVersionButton: PropTypes.func,
    hasChangelog: PropTypes.bool,
}

export default Versions
