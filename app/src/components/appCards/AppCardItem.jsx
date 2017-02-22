import React from 'react';
import { Link } from 'react-router-dom';
import AppView from '../appView/AppView';
import Col from '../../material/Grid/Col';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import Button from 'react-toolbox/lib/button/Button';

const AppItem = (props) => {
    const { id, appName, developer, description, appType, requiredDhisVersion } = props.app;

    const mediaStyle = {
        backgroundImage: 'url("https://avatars1.githubusercontent.com/u/13482715?v=3&s=400")',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '190px'
    }

    return (
        <Card>
           <Link to={`/app/${id}`}>
            <CardMedia style={mediaStyle}>
            </CardMedia>
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
