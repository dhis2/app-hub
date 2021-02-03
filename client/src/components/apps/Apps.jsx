import PropTypes from 'prop-types'
import React, { useState, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { loadChannels } from '../../actions/actionCreators'
import { useQuery } from '../../api/api'
import Grid from '../../material/Grid/Grid'
import Col from '../../material/Grid/Col'
import Spinner from '../utils/Spinner'
import AppCards from './appCards/AppCards'
import Filters from './Filters'
import Pagination from './Pagination'

const types = {
    'APP': 'Standard app',
    'DASHBOARD_WIDGET': 'Dashboard app',
    'TRACKER_DASHBOARD_WIDGET': 'Tracker widget'
}

const Apps = ({ loadChannels, channelsData }) => {
    useEffect(loadChannels, [])

    const [channelsFilter, setChannelsFilter] = useState(['Stable'])
    const [typesFilter, setTypesFilter] = useState(Object.keys(types))
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)

    const params = useMemo(() => ({
        channels: channelsFilter,
        types: typesFilter,
        query,
        page
    }), [channelsFilter, typesFilter, query, page])
    const { data, error } = useQuery('apps', params)

    if (channelsData.loading) {
        return <Spinner size="large" />
    }

    return (
        <Grid>
            <Col span={12}>
                <Filters
                    channels={channelsData.channels}
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
                    error={error}
                    apps={data?.apps} />
            </Col>
            {(!error && data) ? (
                <Col span={12}>
                    <Pagination
                        page={page}
                        pageCount={data.pager.pageCount}
                        onPageChange={setPage} />
                </Col>
            ) : null}
        </Grid>
    )
}

Apps.propTypes = {
    channels: PropTypes.object,
    loadChannels: PropTypes.func,
}

const mapStateToProps = state => ({
    channelsData: {
        loading: state.channels.loading,
        channels: state.channels.list.reduce((channels, channel) => {
            channels[channel.name] = channel.name
            return channels
        }, {}),
    },
})

const mapDispatchToProps = dispatch => ({
    loadChannels() {
        dispatch(loadChannels())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Apps)
