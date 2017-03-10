import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List} from 'material-ui/List';
import {Card, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import AppListItem from './AppListItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SubHeader from '../../header/SubHeader';
import {approveApp, loadAllApps, setAppApproval, userAppsLoad, openDialog} from '../../../actions/actionCreators';
import * as dialogTypes from '../../../constants/dialogTypes';
import {mapValues, sortBy} from 'lodash';
class AppList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appFilter: '',
        }
        this.filterApp = this.filterApp.bind(this);
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

    openDeleteDialog(app) {
        this.props.openDeleteDialog({app});
    }

    filterApp(app) {
        const valsToFilter = ['name', 'appType', 'organisation'];
        let match = false;
        for (let i = 0; i < valsToFilter.length; i++) {
            const val = valsToFilter[i];
            const prop = app[val];
            if (prop) {
                if (prop.toLowerCase().includes(this.state.appFilter)) {
                    match = true;
                    break;
                }
            }
            const devProp = app.developer[val];
            if(app.developer && devProp) {
                if(devProp.toLowerCase().includes(this.state.appFilter)) {
                    match = true;
                    break;
                }
            }
        }
        return match;
    }

    handleSearchChange(e) {
        this.setState({
            ...this.state,
            appFilter: e.target.value.toLowerCase()
        })
    }

    render() {
        const {user: {manager}, match, appList} = this.props;
        const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
            {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]

        const apps = sortBy(appList, ['name']).filter(app => this.filterApp(app)).map((app, i) => (
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
                    <TextField style={{maxWidth: '120px'}} hintText="Search"
                               onChange={this.handleSearchChange.bind(this)}
                               value={this.state.appFilter}></TextField>
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
    user: state.user.userInfo
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
