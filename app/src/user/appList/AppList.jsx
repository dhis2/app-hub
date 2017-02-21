import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List} from 'material-ui/List';
import {Card, CardText} from 'material-ui/Card';
import {withReactRouterLink} from '../../utils/RRHOC';
import AppListItem from './AppListItem';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';


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

    }

    handleChange(name, value) {
        console.log(value)
        this.setState({
            ...this.state,
            [name]: value,
        });
    }

    render() {
        const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
            {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]
        const apps = this.props.appList.map((app, i) => (
            <AppListItem app={app} key={i} />
        ))
        return (
            <div>
                <Toolbar style={{backgroundColor:'white', marginBottom:'10px'}}>
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
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, null)(AppList);
