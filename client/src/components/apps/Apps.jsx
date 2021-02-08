import React, { useState, useMemo } from 'react'
import { useQuery } from '../../api/api'
import Grid from '../../material/Grid/Grid'
import Col from '../../material/Grid/Col'
import config from '../../../config'
import AppCards from './appCards/AppCards'
import Filters from './Filters'
import Pagination from './Pagination'

const defaultChannelsFilter = new Set([config.ui.defaultAppChannel])
const defaultTypesFilter = new Set(Object.keys(config.ui.appTypeToDisplayName))

const Apps = () => {
    const [channelsFilter, setChannelsFilter] = useState(defaultChannelsFilter)
    const [typesFilter, setTypesFilter] = useState(defaultTypesFilter)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)

    const params = useMemo(
        () => ({
            channels: channelsFilter,
            types: typesFilter,
            query,
            page,
            pageSize: 12,
        }),
        [channelsFilter, typesFilter, query, page]
    )
    const { data, error } = useQuery('apps', params)
    const apps = data?.result

    return (
        <Grid>
            <Col span={12}>
                <Filters
                    channels={config.ui.appChannelToDisplayName}
                    channelsFilter={channelsFilter}
                    onChannelsFilterChange={setChannelsFilter}
                    types={config.ui.appTypeToDisplayName}
                    typesFilter={typesFilter}
                    onTypesFilterChange={setTypesFilter}
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
