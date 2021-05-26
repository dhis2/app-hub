// eslint-disable-next-line react/no-deprecated
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../../../config'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import Theme from '../../../styles/theme'

// SVG data URL for wallpaper
const svgDataUrl = `'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgb(255,255,255)" d="M4 4h7V2H4c-1.1 0-2 .9-2 2v7h2V4zm6 9l-4 5h12l-3-4-2.03 2.71L10 13zm7-4.5c0-.83-.67-1.5-1.5-1.5S14 7.67 14 8.5s.67 1.5 1.5 1.5S17 9.33 17 8.5zM20 2h-7v2h7v7h2V4c0-1.1-.9-2-2-2zm0 18h-7v2h7c1.1 0 2-.9 2-2v-7h-2v7zM4 13H2v7c0 1.1.9 2 2 2h7v-2H4v-7z"></path></svg>'`

const AppItem = ({ app }) => {
    const { id, name, developer, appType, images } = app
    const logo = images.find(elem => elem.logo)
    const backgroundImage = `url(${logo ? logo.imageUrl : svgDataUrl})`
    const mediaStyle = {
        backgroundImage: backgroundImage,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: logo ? 'cover' : 'contain',
        backgroundColor: logo ? '#ffffff' : Theme.palette.primary1Color,
        height: '190px',
    }

    return (
        <div data-test="app-card" style={{ height: '100%' }}>
            <Card style={{ height: '100%' }}>
                <Link to={`/app/${id}`}>
                    <CardMedia style={mediaStyle} />
                </Link>
                <CardTitle
                    title={<Link to={`/app/${id}`}>{name}</Link>}
                    subtitle={
                        <span>
                            {developer.organisation ||
                                developer.name ||
                                'Unspecified'}
                            <br />
                            {config.ui.appTypeToDisplayName[appType]}{' '}
                        </span>
                    }
                />
            </Card>
        </div>
    )
}

AppItem.propTypes = {
    app: PropTypes.shape({
        appType: PropTypes.string,
        description: PropTypes.string,
        developer: PropTypes.shape({
            name: PropTypes.string,
            organisation: PropTypes.string,
        }),
        id: PropTypes.string,
        images: PropTypes.array,
        name: PropTypes.string,
        requiredDhisVersion: PropTypes.string,
    }),
}

export default AppItem
