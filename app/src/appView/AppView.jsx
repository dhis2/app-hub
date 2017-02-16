import React, {Component, Proptypes} from 'react';
import {connect} from 'react-redux';
import AppItem from './AppItem';
import Grid from '../material/Grid/Grid';
import Col from '../material/Grid/Col';
import { Redirect, Route } from 'react-router-dom';
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
                                    <li>
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
        if (!this.props.appList || this.props.appList.length < 1) {
            return null;
        }
        const app = this.props.appList.find(app => app.id == this.props.match.params.appId);

        if(!app || app == 'undefined') {
            return (<div>Error!</div>);
        }


        const {id, appName, developer, description, appType, requiredDhisVersion, lastUpdated, versions} = app;
        return (
            <Grid >
                <Col span={8} additionalClasses="paper">
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
                            {this.renderVersions(versions)}
                        </section>
                        <section className="mdc-card__actions">
                            <a href={versions[0].downloadUrl}>
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

AppView.proptypes = {}

const mapStateToProps = (state) => ({
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, null)(AppView);
