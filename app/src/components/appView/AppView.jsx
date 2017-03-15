import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { Card, CardText, CardTitle, CardHeader, CardMedia } from 'material-ui/Card';
import ImageViewer from './ImageViewer';
import Subheader from '../header/SubHeader';
import Toolbar from '../../material/Toolbar/Toolbar';
import ToolbarSection from '../../material/Toolbar/ToolbarSection';
import Grid from '../../material/Grid/Grid';
import Col from '../../material/Grid/Col';
import {Link} from 'react-router-dom';
import {Redirect, Route} from 'react-router-dom';
import VersionList from '../appVersion/VersionList';
import {appLoad} from '../../actions/actionCreators';
import { appTypesToUI } from '../../constants/apiConstants';
import AppCards from '../appCards/AppCards'
const appTypes = {
    APP_STANDARD: 'Standard',
    APP_DASHBOARD: 'Dashboard',
    APP_TRACKER_DASHBOARD: 'Tracker Dashboard'
}

class AppView extends Component {

    constructor(props) {
        super(props);

        this.renderVersions = this.renderVersions.bind(this);
    }

    componentDidMount() {
        this.props.loadApp({appId: this.props.match.params.appId});
    }

    renderVersions(versions) {
        return (
            <div>
                {
                    versions.map((app, i) => (
                        <div key={i}>
                            <ul className="ver-list">
                                <li>
                                    <a href={app.downloadUrl}> <i className="material-icons">file_download</i></a>
                                    Version: {app.version}

                                </li>
                                <ul>
                                    <li title={new Date(app.created).toLocaleString()}>
                                        Created: {new Date(app.created).toLocaleDateString()} </li>
                                    <li title={new Date(app.lastUpdated).toLocaleString()}>
                                        Last updated: {new Date(app.lastUpdated).toLocaleDateString()}
                                    </li>
                                    <li>
                                        Min DHIS version: {app.minDhisVersion ? app.minDhisVersion : 'Unspecified'}</li>
                                    <li>
                                        Max DHIS version: {app.maxDhisVersion ? app.maxDhisVersion : 'Unspecified'}</li>
                                </ul>
                            </ul>
                        </div>
                    ))
                }
            </div>
        )
    }

    render() {
        const app = this.props.app;
        if (!this.props.app) {
            return null;
        }


        const {id, appName, developer, description, appType, requiredDhisVersion, lastUpdated} = app;
        const versions = app.versions.sort((a, b) => a.lastUpdated - b.lastUpdated)
        const subtitle = (<div>Type: {appTypesToUI[app.appType]} <br />
            Author: {app.developer.name} <br />
            Organisation: {app.developer.organisation} </div>)


        return(
            <Grid>
                <Col span={8} center>
                <Subheader title="App overview" backLink="/" />
                <Card>
                    <CardHeader title={app.name} avatar={"https://avatars1.githubusercontent.com/u/13482715?v=3&s=400"}
                                subtitle={subtitle} titleStyle={{fontSize: '2em'}}>
                    </CardHeader>
                    <CardText>
                        <ImageViewer/>
                    </CardText>
                    <CardText>
                        {app.description}
                    </CardText>

                </Card>

                <Card style={{marginTop: '10px', position: 'relative'}}>
                    <CardTitle title="Versions" />
                    <CardText>
                        <VersionList versionList={app.versions} app={app}/>
                    </CardText>
                </Card>
                </Col>
            </Grid>
        )
    }
}

AppView.propTypes = {
    app: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
    app: state.appsList.byId[ownProps.match.params.appId],
});

const mapDispatchToProps = (dispatch) => ({
    loadApp(appId) {
        dispatch(appLoad(appId))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
