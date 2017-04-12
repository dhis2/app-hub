import React from 'react';
import { Link } from 'react-router-dom';
import { appTypesToUI } from '../../../config';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'material-ui/Card';
import Button from 'material-ui/FlatButton';
import Theme from '../../styles/theme';

const AppItem = (props) => {
    const { id, name, developer, description, appType, images, requiredDhisVersion } = props.app;
    let logo = images.filter(elem => elem.logo)[0];
    let backgroundImage = '';
    //svg-string for wallpaper
    let svgStr = 'data:image/svg+xml;utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"#fff\" d=\"M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z\"></path></svg>'
    if(logo) {
        backgroundImage = 'url('+logo.imageUrl+')';
    } else {
       backgroundImage = 'url(\''+svgStr+'\')';
    }
    const mediaStyle = {
        backgroundImage: backgroundImage,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: logo ? 'cover' : 'contain',
        backgroundColor: Theme.palette.primary1Color,
        height: '190px'
    }

    return (
        <Card>
           <Link to={`/app/${id}`}>
            <CardMedia style={mediaStyle}>
            </CardMedia>
            </Link>
            <CardTitle title={<Link to={`/app/${id}`}>{name}</Link>}
                       subtitle={(<span>{developer.name ? developer.name : 'Unspecified'} <br /> {appTypesToUI[appType]} </span>)}/>
            <CardActions>
                <Link to={`/app/${id}`}><Button label="More" /></Link>
            </CardActions>
        </Card>
    );
}

export default AppItem;
