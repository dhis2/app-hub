import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Toolbar from '../../material/Toolbar/Toolbar';
import ToolbarSection from '../../material/Toolbar/ToolbarSection';
import Grid from '../../material/Grid/Grid';
import Col from '../../material/Grid/Col';
import {Link} from 'react-router-dom';
import {Redirect, Route} from 'react-router-dom';
import VersionList from '../appVersion/VersionList';
import {appLoad} from '../../actions/actionCreators';
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
        return (
            <Grid >
                <Col span={8} additionalClasses="paper">
                    <Toolbar additionalClasses="second-header">
                        <ToolbarSection align="start">
                            <Link to="/"> <i className="material-icons">arrow_back</i></Link>
                        </ToolbarSection>
                    </Toolbar>
                    <div className="mdc-card" style={{height: '100%', margin: "0 auto 0 auto "}}>
                        <section className="mdc-card__primary">

                            <h1 className="mdc-card__title mdc-card__title--large">{appName}</h1>
                            <h2 className="mdc-card__subtitle">Author: {developer.developerName}</h2>
                            <h2 className="mdc-card__subtitle">Type: {appTypes[appType]}</h2>
                            <h2 className="mdc-card__subtitle">Last
                                updated: {new Date(lastUpdated).toLocaleDateString()}</h2>
                            <div>
                                {}
                            </div>
                        </section>
                        <section className="mdc-card__supporting-text">
                            {description}
                        </section>
                        <section className="mdc-card__supporting-text">
                            <h2>Versions</h2>
                            <VersionList versionList={versions}/>
                        </section>
                        <section className="mdc-card__actions">
                            <a href={versions[versions.length - 1].downloadUrl}>
                                <button className="mdc-button mdc-button--primary mdc-button--compact mdc-card__action">
                                    Download latest
                                </button>
                            </a>
                        </section>
                    </div>
                </Col>
            </Grid>
        )
    }
}

AppView.propTypes = {
    app: PropTypes.object
}

const mapStateToProps = (state, ownProps) => ({
    app: state.appsList.appList[ownProps.match.params.appId],
});

const mapDispatchToProps = (dispatch) => ({
    loadApp(appId) {
        dispatch(appLoad(appId))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
