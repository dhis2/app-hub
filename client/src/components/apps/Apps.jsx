import React, { useMemo } from 'react'
import {
    useQueryParams,
    StringParam,
    NumberParam,
    encodeDelimitedArray,
    decodeDelimitedArray,
    withDefault,
} from 'use-query-params'
import { useQuery } from '../../api/api'
import config from '../../../config'
import AppCards from './appCards/AppCards'
import Filters from './Filters/Filters'
import Pagination from './Pagination'
import styles from './Apps.module.css'

const defaultChannelsFilter = new Set([config.ui.defaultAppChannel])
const defaultTypesFilter = new Set(Object.keys(config.ui.appTypeToDisplayName))

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
        query: StringParam,
        page: withDefault(NumberParam, 1),
    })
    const { channels, types, query, page } = queryParams
    const setChannels = channels => {
        setQueryParams({ channels, page: 1 })
    }
    const setTypes = types => {
        setQueryParams({ types, page: 1 })
    }
    const setQuery = query => {
        setQueryParams({ query, page: 1 }, 'replaceIn')
    }
    const setPage = page => {
        setQueryParams({ page })
    }

    const params = useMemo(
        () => ({
            channels,
            types,
            query,
            page,
            pageSize: 24,
        }),
        [channels, types, query, page]
    )
    const { data, error } = useQuery('apps', params)
    const apps = data?.result

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Filters
                    channels={config.ui.appChannelToDisplayName}
                    channelsFilter={channels}
                    onChannelsFilterChange={setChannels}
                    types={config.ui.appTypeToDisplayName}
                    typesFilter={types}
                    onTypesFilterChange={setTypes}
                    onQueryChange={setQuery}
                />
            </div>
            <div className={styles.content}>
                <AppCards
                    isLoading={!data}
                    error={error?.message}
                    apps={apps}
                />
                {apps?.length > 0 ? (
                    <Pagination
                        page={page}
                        pageCount={data.pager.pageCount}
                        onPageChange={setPage}
                    />
                ) : null}
            </div>
        </div>
    )
}

export default Apps
