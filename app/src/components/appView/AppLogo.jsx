import React, { PropTypes } from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Theme from '../../styles/theme';



const Logo = (props) => {

    const style = {
        base: {
            backgroundColor: props.logo ? '#ffffff' : Theme.palette.primary1Color,
            marginRight: '16px',
        },
        list: {
            left: '16px',
            position: 'absolute'
        }
    }


    const { logo, inList } = props;
    const avatarProps = {
        src: logo ? logo.imageUrl : null,
        icon: !logo ? props.defaultLogo: null
    }
    const avatarStyle = inList ? {...style.base, ...style.list} : style.base
    return (<Avatar style={avatarStyle} {...avatarProps} />)
}

Logo.propTypes = {
    logo: PropTypes.object,
    defaultLogo: PropTypes.element,
    inList: PropTypes.bool,
}

Logo.defaultProps = {
    defaultLogo: <FontIcon className="material-icons">wallpaper</FontIcon>,
    inList: false,
}

export default Logo;