import React from 'react';
import { Link } from 'react-router-dom';
import AppView from '../appView/AppView';
import Col from '../../material/Grid/Col';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import Button from 'react-toolbox/lib/button/Button';

const AppItem = (props) => {
    const { id, name, developer, description, appType, requiredDhisVersion } = props.app;

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
            <CardTitle title={<Link to={`/app/${id}`}>{name}</Link>}
                       subtitle={(<span>{developer.name ? developer.name : 'Unspecified'} <br /> {appType} </span>)}/>
            <CardActions>
                <Link to={`/app/${id}`}><Button accent label="More" /></Link>
            </CardActions>
        </Card>
    );
}

export default AppItem;
