import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List} from 'material-ui/List';
import {Card, CardText} from 'material-ui/Card';
import AppListItem from './AppListItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {approveApp, appsAllLoad, appsApprovedLoad, userAppsLoad} from '../../../actions/actionCreators';

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
        if(user) {
            user.manager ? this.props.loadAllApps() : this.props.loadMyApps()
        }
    }
    componentWillReceiveProps(nextProps) {
        //Load when user is loaded and no applist has been loaded yet
        if (nextProps.user && !nextProps.appList) {
            nextProps.user.manager ? this.props.loadAllApps() : this.props.loadMyApps()

        }

    }

    handleChange(name, value) {
        console.log(value)
        this.setState({
            ...this.state,
            [name]: value,
        });
    }

    handleApprove(app) {
        console.log(app)
        this.props.approveApp(app);
    }

    render() {
        const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
            {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]


        const apps = this.props.appList ? this.props.appList.map((app, i) => (
                <AppListItem app={app} key={i} handleApprove={this.handleApprove.bind(this, app)}/>
            )) : []

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
    approveApp(app) {
        dispatch(approveApp(app))
    },

    loadAllApps() {
        dispatch(appsAllLoad())
    },

    loadMyApps() {
        dispatch(userAppsLoad())
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(AppList);
