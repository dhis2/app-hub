import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { Card, CardText, CardTitle, CardHeader, CardMedia } from 'material-ui/Card';
import ImageViewer from './ImageViewer';
import Subheader from '../header/SubHeader';
import Grid from '../../material/Grid/Grid';
import Col from '../../material/Grid/Col';
import {Link} from 'react-router-dom';
import {Redirect, Route} from 'react-router-dom';
import VersionList from '../appVersion/VersionList';
import {loadApp} from '../../actions/actionCreators';
import { appTypesToUI } from '../../../config';
import AppLogo from './AppLogo';


class AppView extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.props.loadApp({appId: this.props.match.params.appId});
    }

    render() {
        const app = this.props.app;
        if (!this.props.app) {
            return null;
        }


        const {id, appName, developer, description, images, appType, requiredDhisVersion, lastUpdated} = app;
        const versions = app.versions.sort((a, b) => a.lastUpdated - b.lastUpdated)
        const subtitle = (<div>Type: {appTypesToUI[app.appType]} <br />
            Author: {app.developer.name} <br />
            Organisation: {app.developer.organisation} </div>)

        let logo = images.filter(elem => elem.logo)[0];

        return(
            <Grid>
                <Col span={8} center>
                <Subheader title="App overview" backLink="/" />
                <Card>
                    <CardHeader title={app.name} avatar={<AppLogo logo={logo} />}
                                subtitle={subtitle} titleStyle={{fontSize: '2em'}}>
                    </CardHeader>
                    <CardText style={{paddingLeft: 0, paddingRight: 0}}>
                        <ImageViewer images={app.images} showEmptyMessage={false}/>
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
        dispatch(loadApp(appId))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
