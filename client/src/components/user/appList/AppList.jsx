import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List } from 'material-ui/List'
import { Card, CardText } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import AppListItem from './AppListItem'
import Popover from 'material-ui/Popover'
import { TextFilter, SelectFilter } from '../../utils/Filters'
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle,
} from 'material-ui/Toolbar'
import Button from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import SubHeader from '../../header/SubHeader'
import {
    approveApp,
    loadAllApps,
    setAppApproval,
    userAppsLoad,
    openDialog,
} from '../../../actions/actionCreators'
import * as dialogTypes from '../../../constants/dialogTypes'
import sortBy from 'lodash/sortBy'
import ErrorOrLoading from '../../utils/ErrorOrLoading'
import * as selectors from '../../../selectors/userSelectors'
import {
    APP_STATUS_APPROVED,
    APP_STATUS_PENDING,
    APP_STATUS_REJECTED,
} from '../../../constants/apiConstants'
import PopoverWithReduxState from '../../../utils/PopoverWithReduxState'

/**
 * Filters an app according to properties defined in valsToFilter.
 * @param app to filter
 * @param filter a string to check if any of the properties in app contains this.
 * @returns {boolean} true if any of the properties matches the filter.
 */
const filterApp = (app, filterVal) => {
    if (!filterVal) return true
    const filter = filterVal.toLowerCase()
    const valsToFilter = ['name', 'appType', 'organisation']
    for (const val of valsToFilter) {
        const prop = app[val] || app.developer[val]
        if (prop && prop.toLowerCase().includes(filter)) {
            return true
        }
    }
    return false
}

/**
 *
 * @param app to filter.
 * @param filters an redux-form object containing filters to check for app.
 * Should be of shape {filters: values}. Values should be of shape {appType: bool}.
 * @returns {boolean} true if app has an apptype in filter, otherwise false.
 */
const filterAppType = (app, filters) => {
    if (!filters || filters.values.length == 0) {
        return true
    }

    const filterVal = filters.values
    for (const key in filterVal) {
        if (filterVal.hasOwnProperty(key)) {
            if (key == app.appType && filterVal[key] === true) {
                return true
            }
        }
    }
    return false
}

const filterAppStatus = (app, filters) => {
    if (!filters || filters.values.length == 0) {
        return true
    }

    const filterVal = filters.values
    for (const key in filterVal) {
        if (filterVal.hasOwnProperty(key)) {
            if (key == app.status && filterVal[key]) {
                return true
            }
        }
    }
    return false
}

class AppList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }
    }

    componentDidMount() {
        const user = this.props.user
        if (user) {
            user.manager ? this.props.loadAllApps() : this.props.loadMyApps()
        }
    }

    handleApproval(app, type) {
        switch (type) {
            case 'APPROVE': {
                this.props.setAppApproval(app, APP_STATUS_APPROVED)
                break
            }
            case 'REJECT': {
                this.props.setAppApproval(app, APP_STATUS_REJECTED)
                break
            }
        }
    }

    handleOpenFilters(e) {
        this.setState({
            ...this.state,
            open: !this.state.open,
            anchorEl: e.currentTarget,
        })
    }

    openDeleteDialog(app) {
        this.props.openDeleteDialog({ app })
    }

    renderStatusFilters() {
        return (
            <div>
                <h4>App status</h4>
                <SelectFilter
                    renderAllToggle={false}
                    form="appStatusFilter"
                    filters={[
                        {
                            label: 'Approved',
                            toggled: true,
                            value: APP_STATUS_APPROVED,
                        },
                        {
                            label: 'Pending',
                            toggled: true,
                            value: APP_STATUS_PENDING,
                        },
                        {
                            label: 'Rejected',
                            toggled: true,
                            value: APP_STATUS_REJECTED,
                        },
                    ]}
                />
            </div>
        )
    }

    render() {
        const { loading, loaded, error, byId: appList } = this.props.appList
        const loadOrErr = loading || error
        const {
            user: { manager },
            match,
            appSearchFilter,
        } = this.props
        const searchFilter = appSearchFilter
            ? appSearchFilter.values.searchFilter
            : ''
        const apps = sortBy(appList, ['name'])
            .filter(
                app =>
                    filterApp(app, searchFilter) &&
                    filterAppType(app, this.props.appTypeFilter) &&
                    (manager
                        ? filterAppStatus(app, this.props.appStatusFilter)
                        : true)
            )
            .map((app, i) => (
                <AppListItem
                    app={app}
                    key={app.id}
                    isManager={manager}
                    match={this.props.match}
                    handleDelete={this.openDeleteDialog.bind(this, app)}
                    handleApprove={this.handleApproval.bind(
                        this,
                        app,
                        'APPROVE'
                    )}
                    handleReject={this.handleApproval.bind(this, app, 'REJECT')}
                />
            ))
        const emptyAppsText = manager
            ? "We couldn't find any apps"
            : 'You have not uploaded any apps'
        const title = manager ? 'All apps' : 'Your apps'

        return (
            <div>
                <SubHeader title={title}>
                    <TextFilter hintText="Search" />
                    <IconButton onClick={this.handleOpenFilters.bind(this)}>
                        <FontIcon className="material-icons">
                            filter_list
                        </FontIcon>
                    </IconButton>
                    <PopoverWithReduxState
                        open={this.state.open}
                        anchorEl={this.state.anchorEl}
                        style={{ width: '200px' }}
                        onRequestClose={r => this.setState({ open: false })}
                    >
                        <div style={{ padding: '10px' }}>
                            <h3>App type</h3>
                            <SelectFilter
                                renderAllToggle={false}
                                form="appTypeFilterUser"
                                filters={[
                                    {
                                        label: 'Standard',
                                        toggled: true,
                                        value: 'APP',
                                    },
                                    {
                                        label: 'Dashboard',
                                        toggled: true,
                                        value: 'DASHBOARD_WIDGET',
                                    },
                                    {
                                        label: 'Tracker',
                                        toggled: true,
                                        value: 'TRACKER_DASHBOARD_WIDGET',
                                    },
                                ]}
                            />
                            {manager ? this.renderStatusFilters() : null}
                        </div>
                    </PopoverWithReduxState>
                </SubHeader>
                <Card>
                    <CardText>
                        {loadOrErr ? (
                            <ErrorOrLoading loading={loading} error={error} />
                        ) : null}
                        <List>
                            {loaded && apps.length > 0 ? apps : null}
                            {loaded && apps.length < 1 ? emptyAppsText : null}
                        </List>
                    </CardText>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    appList: selectors.getUserAppList(state),
    user: selectors.getUserProfile(state),
    appTypeFilter: state.form.appTypeFilterUser,
    appStatusFilter: state.form.appStatusFilter,
    appSearchFilter: state.form.searchFilter,
})

const mapDispatchToProps = dispatch => ({
    setAppApproval(app, status) {
        dispatch(setAppApproval(app, status))
    },

    openDeleteDialog(app) {
        dispatch(openDialog(dialogTypes.CONFIRM_DELETE_APP, app))
    },

    loadAllApps() {
        dispatch(loadAllApps())
    },

    loadMyApps() {
        dispatch(userAppsLoad())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(AppList)
