import React from 'react';
import { Link } from 'react-router-dom';
import AppView from '../appView/AppView';
import Col from '../material/Grid/Col';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import Button from 'react-toolbox/lib/button/Button';

const AppItem = (props) => {
    const { id, appName, developer, description, appType, requiredDhisVersion } = props.app;

    return (
        <Card>
           <Link to={`/app/${id}`}>
            <CardMedia aspectRatio="wide" image="https://avatars1.githubusercontent.com/u/13482715?v=3&s=400"/>
            </Link>
            <CardTitle title={<Link to={`/app/${id}`}>{appName}</Link>}
                       subtitle={developer.developerName ? developer.developerName : 'Unspecified'} />

            <CardText>
                <p className="card-text">{description}</p>

            </CardText>
            <CardActions>
                <Link to={`/app/${id}`}><Button accent label="More" /></Link>
            </CardActions>
        </Card>
    );
}

export default AppItem;
