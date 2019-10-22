import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppCardItem from './AppCardItem'
import Grid from '../../material/Grid/Grid'
import Col from '../../material/Grid/Col'
import Popover from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import {
    loadAllApps,
    loadApprovedApps,
    loadChannels,
} from '../../actions/actionCreators'
import {
    TextFilter,
    filterApp,
    SelectFilter,
    filterAppType,
} from '../utils/Filters'
import { ToolbarGroup } from 'material-ui/Toolbar'
//import {values, sortBy} from 'lodash';
import sortBy from 'lodash/sortBy'
//import values from 'lodash/values';
import SubHeader from '../header/SubHeader'
import ErrorOrLoading from '../utils/ErrorOrLoading'
import { FadeAnimation, FadeAnimationList } from '../utils/Animate'
import '../../styles/utils/animations.scss'
import Theme from '../../styles/theme'
class AppCards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            channelFilterOpen: false,
            channelFilterAnchorEl: null,
        }
    }

    componentDidMount() {
        this.props.loadApps()
        this.props.loadChannels()
    }

    handleOpenFilters(e) {
        this.setState({
            ...this.state,
            channelFilterOpen: !this.state.channelFilterOpen,
            channelFilterAnchorEl: e.currentTarget,
        })
    }

    render() {
        const styles = {
            grid: {
                padding: 0,
            },
            filters: {
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                width: 'auto',
                margin: '0 auto 0 auto',
            },
            filterElem: {
                display: 'inline-flex',
                margin: '10px',
                width: 'auto',
            },
            appItem: {},

            emptyApps: {
                textAlign: 'center',
            },
        }
        const { loaded, error, byId: cards } = this.props.appList
        const loading =
            this.props.appList.loading || this.props.channels.loading

        const loadOrErr = loading || error
        const searchFilter = this.props.appSearchFilter
            ? this.props.appSearchFilter.values.searchFilter
            : ''

        //filter and construct appcards
        const apps = sortBy(cards, ['name'])
            .filter(
                app =>
                    filterApp(app, searchFilter) &&
                    filterAppType(app, this.props.filters)
            )
            .map((app, i) => (
                <Col key={app.id} span={3} phone={4} style={styles.appItem}>
                    <AppCardItem key={app.id} app={app} />
                </Col>
            ))

        const emptyApps = (
            <FadeAnimation appear>
                <Col align="middle" span={12} style={styles.emptyApps}>
                    <p>We couldn't find any apps.</p>
                </Col>
            </FadeAnimation>
        )
        return (
            <Grid>
                <Col span={12} style={{}}>
                    <SubHeader style={{ marginBottom: 0 }}>
                        <ToolbarGroup>
                            <TextFilter hintText="Search" />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <SelectFilter
                                form="appTypeFilter"
                                style={styles.filters}
                                elementStyle={styles.filterElem}
                                labelStyle={{ width: 'auto' }}
                                filters={[
                                    {
                                        label: 'Standard app',
                                        toggled: true,
                                        value: 'APP',
                                    },
                                    {
                                        label: 'Dashboard app',
                                        toggled: true,
                                        value: 'DASHBOARD_WIDGET',
                                    },
                                    {
                                        label: 'Tracker widget',
                                        toggled: true,
                                        value: 'TRACKER_DASHBOARD_WIDGET',
                                    },
                                ]}
                            />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <IconButton
                                onClick={this.handleOpenFilters.bind(this)}
                            >
                                <FontIcon className="material-icons">
                                    filter_list
                                </FontIcon>
                            </IconButton>
                            <Popover
                                open={this.state.channelFilterOpen}
                                anchorEl={this.state.channelFilterAnchorEl}
                                style={{ width: '200px' }}
                                onRequestClose={r =>
                                    this.setState({ channelFilterOpen: false })
                                }
                            >
                                <div style={{ padding: '10px' }}>
                                    <h3>Channel</h3>
                                    <SelectFilter
                                        renderAllToggle
                                        form="releaseChannel"
                                        filters={this.props.channels.channels.map(
                                            c => ({
                                                label: c.name,
                                                toggled: false,
                                                value: c.id,
                                            })
                                        )}
                                    />
                                </div>
                            </Popover>
                        </ToolbarGroup>
                    </SubHeader>
                </Col>
                <Col span={12}>
                    {loadOrErr || !apps ? (
                        <ErrorOrLoading
                            loading={loading}
                            error={error}
                            retry={this.props.loadApps}
                        />
                    ) : (
                        <FadeAnimationList
                            component={Grid}
                            nested
                            nestedStyle={styles.grid}
                            exit={false}
                        >
                            {apps}
                        </FadeAnimationList>
                    )}
                    {loaded && apps.length < 1 && emptyApps}
                </Col>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    appList: state.appsList,
    filters: state.form.appTypeFilter,
    appSearchFilter: state.form.searchFilter,
    channels: state.channels,
})

const mapDispatchToProps = dispatch => ({
    loadApps() {
        dispatch(loadApprovedApps())
    },
    loadChannels() {
        dispatch(loadChannels())
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppCards)
