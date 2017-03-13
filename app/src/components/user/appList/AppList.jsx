import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List} from 'material-ui/List';
import {Card, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import AppListItem from './AppListItem';
import Popover from 'material-ui/Popover';
import {TextFilter, filterApp, SelectFilter, filterAppType} from '../../utils/Filters';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Button from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import SubHeader from '../../header/SubHeader';
import {approveApp, loadAllApps, setAppApproval, userAppsLoad, openDialog} from '../../../actions/actionCreators';
import * as dialogTypes from '../../../constants/dialogTypes';
import {mapValues, sortBy} from 'lodash';

class AppList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }
    }

    componentDidMount() {
        const user = this.props.user;
        if (user) {
            user.manager ? this.props.loadAllApps() : this.props.loadMyApps()
        }
    }

    componentWillReceiveProps(nextProps) {
        //Load when user is loaded and no applist has been loaded yet
        if (nextProps.user && !nextProps.appList) {
            //  nextProps.user.manager ? this.props.loadAllApps() : this.props.loadMyApps()

        }

    }

    handleApproval(app, type) {
        console.log(app)
        switch (type) {
            case 'APPROVE': {
                this.props.approveApp({app, status: 'APPROVED'});
                break;
            }
            case 'REJECT': {
                this.props.approveApp({app, status: 'NOT_APPROVED'})
                break;
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
        this.props.openDeleteDialog({app});
    }

    render() {
        const {user: {manager}, match, appList, appSearchFilter} = this.props;
        const searchFilter = appSearchFilter ? appSearchFilter.values.searchFilter : '';

        const apps = sortBy(appList, ['name'])
            .filter(app => filterApp(app, searchFilter) && filterAppType(app, this.props.appTypeFilter))
            .map((app, i) => (
            <AppListItem app={app} key={app.id} isManager={manager}
                         match={this.props.match}
                         handleDelete={this.openDeleteDialog.bind(this, app)}
                         handleApprove={this.handleApproval.bind(this, app, 'APPROVE')}
                         handleReject={this.handleApproval.bind(this, app, 'REJECT')}/>
        ))
        const title = manager ? "All apps" : "Your apps";
        return (
            <div>
                <SubHeader title={title}>
                    <TextFilter style={{maxWidth: '120px'}} hintText="Search"/>
                    <IconButton onClick={this.handleOpenFilters.bind(this)}><FontIcon className="material-icons">filter_list</FontIcon> </IconButton>
                    <Popover open={this.state.open} anchorEl={this.state.anchorEl} style={{ width:'200px'}}
                    onRequestClose={(r) => this.setState({open:false})}>
                        <div style={{padding:'10px'}}>
                        <SelectFilter
                            renderAllToggle
                            form="appTypeFilter"
                            filters={[{label: 'Standard', toggled: true, value: 'APP_STANDARD'},
                                {label: 'Dashboard', toggled: true, value:'APP_DASHBOARD'},
                                {label: 'Tracker Dashboard', toggled: true, value:'APP_TRACKER_DASHBOARD'}]}
                           />
                        </div>
                    </Popover>
                </SubHeader>
                <Card>
                    <CardText>
                        <List>
                            {apps}
                        </List>
                    </CardText>
                </Card>
            </div>
    )
    }
    }

    const mapStateToProps = (state) => ({
        appList: state.user.appList,
        user: state.user.userInfo,
        appTypeFilter: state.form.appTypeFilter,
        appSearchFilter: state.form.searchFilter,
    });

    const mapDispatchToProps = (dispatch) => ({
        approveApp(payload) {
        dispatch(setAppApproval(payload))
    },

        openDeleteDialog(app) {
        dispatch(openDialog(dialogTypes.CONFIRM_DELETE_APP, app))
    },

        loadAllApps() {
        dispatch(loadAllApps())
    },

        loadMyApps() {
        dispatch(userAppsLoad())
    }

    })

    export default connect(mapStateToProps, mapDispatchToProps)(AppList);
