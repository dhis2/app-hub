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
import Grid from '../../material/Grid/Grid'
import Col from '../../material/Grid/Col'
import config from '../../../config'
import AppCards from './appCards/AppCards'
import Filters from './Filters'
import Pagination from './Pagination'

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
        <Grid>
            <Col span={12}>
                <Filters
                    channels={config.ui.appChannelToDisplayName}
                    channelsFilter={channels}
                    onChannelsFilterChange={setChannels}
                    types={config.ui.appTypeToDisplayName}
                    typesFilter={types}
                    onTypesFilterChange={setTypes}
                    onQueryChange={setQuery}
                />
            </Col>
            <Col span={12}>
                <AppCards
                    isLoading={!data}
                    error={error?.message}
                    apps={apps}
                />
            </Col>
            {apps?.length > 0 ? (
                <Col span={12}>
                    <Pagination
                        page={page}
                        pageCount={data.pager.pageCount}
                        onPageChange={setPage}
                    />
                </Col>
            ) : null}
        </Grid>
    )
}

export default Apps
