import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List} from 'material-ui/List';
import {Card, CardText} from 'material-ui/Card';
import AppListItem from './AppListItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {approveApp, appsAllLoad, setAppApproval, userAppsLoad} from '../../../actions/actionCreators';
import {mapValues, sortBy} from 'lodash';
class AppList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appName: '',
            description: '',
            developerName: '',
            developerEmail: '',
            version: '',
            minVer: '',
            maxVer: '',
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

    handleChange(name, value) {
        console.log(value)
        this.setState({
            ...this.state,
            [name]: value,
        });
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

    render() {
        const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
            {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]
        const appList = this.props.appList;

        const apps = sortBy(appList, ['name']).map((app, i) => (
            <AppListItem app={app} key={i} isManager={this.props.user.manager}
                         match={this.props.match}
                         handleApprove={this.handleApproval.bind(this, app, 'APPROVE')}
                         handleReject={this.handleApproval.bind(this, app, 'REJECT')}/>
        ))

        return (
            <div>
                <Toolbar style={{backgroundColor: 'white', marginBottom: '10px'}}>
                    <ToolbarGroup>
                        <ToolbarTitle text="Apps"/>
                    </ToolbarGroup>

                </Toolbar>
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

    loadAllApps() {
        dispatch(appsAllLoad())
    },

    loadMyApps() {
        dispatch(userAppsLoad())
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(AppList);
