import React from 'react';
import AppView from '../appView/AppView';
import Col from '../material/Grid/Col';
import {
    Link
} from 'react-router-dom'

const AppItem = (props) => {
    const { id, appName, developer, description, appType, requiredDhisVersion } = props.app;
    console.log(developer)
    return (
        <Col span={6} align="top">
            <div className="mdc-card" style={{height: "300px"}}>
                <Link className="" to={`/app/${id}`}>
                <img className="mdc-card__media-item mdc-card__media-item--1dot5x" src="http://www.material-ui.com/images/material-ui-logo.svg"></img>
                </Link>
                <section className="mdc-card__primary">
                    <Link to={`/app/${id}`}> <h1 className="mdc-card__title mdc-card__title--large">{appName}</h1> </Link>
                    <h2 className="mdc-card__subtitle">{developer.developerName}</h2>
                </section>
                <section className="mdc-card__supporting-text">
                    {description}
                </section>
            </div>
        </Col>
    );
}

export default AppItem;