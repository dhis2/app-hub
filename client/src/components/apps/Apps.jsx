import React, { useState, useMemo } from 'react'
import { useQuery } from '../../api/api'
import Grid from '../../material/Grid/Grid'
import Col from '../../material/Grid/Col'
import AppCards from './appCards/AppCards'
import Filters from './Filters'
import Pagination from './Pagination'

const channels = {
    Stable: 'Stable',
    Development: 'Development',
    Canary: 'Canary',
}

const types = {
    APP: 'Standard app',
    DASHBOARD_WIDGET: 'Dashboard app',
    TRACKER_DASHBOARD_WIDGET: 'Tracker widget',
}

const defaultChannelsFilter = new Set(['Stable'])
const defaultTypesFilter = new Set(Object.keys(types))

const Apps = () => {
    const [channelsFilter, setChannelsFilter] = useState(defaultChannelsFilter)
    const [typesFilter, setTypesFilter] = useState(defaultTypesFilter)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)

    const params = useMemo(
        () => ({
            channels: [...channelsFilter],
            types: [...typesFilter],
            query,
            page,
            pageSize: 12,
        }),
        [channelsFilter, typesFilter, query, page]
    )
    const { data, error } = useQuery('apps', params)

    return (
        <Grid>
            <Col span={12}>
                <Filters
                    channels={channels}
                    channelsFilter={channelsFilter}
                    onChannelsFilterChange={setChannelsFilter}
                    types={types}
                    typesFilter={typesFilter}
                    onTypesFilterChange={setTypesFilter}
                    onQueryChange={setQuery}
                />
            </Col>
            <Col span={12}>
                <AppCards
                    isLoading={!data}
                    error={error?.message}
                    apps={data?.apps}
                />
            </Col>
            {data?.apps?.length > 0 ? (
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
