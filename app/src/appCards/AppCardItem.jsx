import React from 'react';
import { Link } from 'react-router-dom';
import AppView from '../appView/AppView';
import Col from '../material/Grid/Col';

const AppItem = (props) => {
    const { id, appName, developer, description, appType, requiredDhisVersion } = props.app;
    console.log(developer)
    return (
        <Col span={6} align="middle" additionalClasses="center">
            <div className="mdc-card">
                <Link to={`/app/${id}`}>
                <img className="mdc-card__media-item mdc-card__media-item--1dot5x" src="http://www.material-ui.com/images/material-ui-logo.svg"></img>
                </Link>
                <section className="mdc-card__primary">
                    <Link to={`/app/${id}`}> <h1 className="mdc-card__title mdc-card__title--large">{appName}</h1> </Link>
                    <h2 className="mdc-card__subtitle">{developer.developerName}</h2>
                </section>
                <section className="mdc-card__supporting-text">
                    {description}
                </section>
                <section className="mdc-card__actions">
                    <Link to={`/app/${id}`}>
                        <button className="mdc-button mdc-button--primary mdc-button--compact mdc-card__action">
                            More
                        </button>
                    </Link>
                </section>
            </div>
        </Col>
    );
}

export default AppItem;