import { Divider, Pagination } from '@dhis2/ui'
import { useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import {
    useQueryParams,
    StringParam,
    NumberParam,
    encodeDelimitedArray,
    decodeDelimitedArray,
    withDefault,
} from 'use-query-params'
import AppCards from './AppCards/AppCards'
import styles from './Apps.module.css'
import Filters from './Filters/Filters'
import { SidebarInfo } from './SidebarInfo/SidebarInfo'
import config from 'config'
import { useQuery } from 'src/api'

const {
    defaultAppChannel,
    appChannelToDisplayName,
    appTypeToDisplayName,
    dhisVersions,
    feature,
} = config.ui

const defaultChannelsFilter = new Set([defaultAppChannel])
const defaultTypesFilter = new Set(Object.keys(appTypeToDisplayName))

const SetParam = {
    encode(set) {
        if (set) {
            return encodeDelimitedArray([...set], ',')
        }
    },
    decode(arrayString) {
        if (arrayString) {
            return new Set(decodeDelimitedArray(arrayString, ','))
        }
    },
}

const Apps = () => {
    const [queryParams, setQueryParams] = useQueryParams({
        channels: withDefault(SetParam, defaultChannelsFilter),
        types: withDefault(SetParam, defaultTypesFilter),
        dhisVersion: StringParam,
        query: withDefault(StringParam, ''),
        page: withDefault(NumberParam, 1),
    })

    const { channels, types, dhisVersion, query, page } = queryParams
    const [debouncedQuery] = useDebounce(query, 300)
    const setChannels = (channels) => {
        setQueryParams({ channels, page: 1 })
    }
    const setTypes = (types) => {
        setQueryParams({ types, page: 1 })
    }
    const setDhisVersion = (dhisVersion) => {
        setQueryParams({ dhisVersion, page: 1 })
    }
    const setQuery = (query) => {
        setQueryParams({ query, page: 1 }, 'replaceIn')
    }
    const setPage = (page) => {
        setQueryParams({ page })
    }

    const params = useMemo(
        () => ({
            channels: feature.channels ? channels : undefined,
            types,
            dhis_version: dhisVersion,
            query,
            page,
            pageSize: 24,
        }),
        [channels, types, dhisVersion, debouncedQuery, page]
    )
    const { data, error } = useQuery('apps', params)

    const { data: organisations } = useQuery('organisations-with-apps')

    const apps = data?.result

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <Filters
                    organisations={organisations}
                    channels={appChannelToDisplayName}
                    channelsFilter={channels}
                    onChannelsFilterChange={setChannels}
                    types={appTypeToDisplayName}
                    typesFilter={types}
                    onTypesFilterChange={setTypes}
                    dhisVersions={dhisVersions}
                    dhisVersionFilter={dhisVersion}
                    onDhisVersionFilterChange={setDhisVersion}
                    query={query}
                    onQueryChange={setQuery}
                />
                <div className={styles.dividerContainer}>
                    <Divider />
                    <SidebarInfo />
                </div>
            </div>
            <div className={styles.apps}>
                <AppCards
                    isLoading={!data}
                    error={error?.message}
                    apps={apps}
                />
                {apps?.length > 0 ? (
                    <Pagination
                        className={styles.pagination}
                        hidePageSizeSelect
                        onPageSizeChange={() => null}
                        onPageChange={setPage}
                        {...data.pager}
                    />
                ) : null}
            </div>
        </div>
    )
}

export default Apps
