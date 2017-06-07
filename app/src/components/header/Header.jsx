import React from 'react';
import { connect } from 'react-redux';
import Toolbar from '../../material/Toolbar/Toolbar';
import ToolbarSection from '../../material/Toolbar/ToolbarSection';
import ToolbarTitle from '../../material/Toolbar/ToolbarTitle';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { getAuth } from '../../utils/AuthService';
import {Link} from 'react-router-dom';
import Theme from '../../styles/theme';
import Avatar from 'material-ui/Avatar';

const renderProfileButton = (props) => {
    const avatarUrl = props.avatarImg;

    const isLoggedIn = props.authenticated;
    const avatar = (<Avatar size={24} src={avatarUrl} />)
    const notLoggedInIcon = (<FontIcon color="white" className="material-icons">account_circle</FontIcon>)
    const button = (<IconButton onClick={() => !isLoggedIn ? getAuth().login() : {}}>
        {isLoggedIn &&  typeof props.avatarImg === 'string' ? avatar : notLoggedInIcon}
    </IconButton>)
    return (isLoggedIn ? <Link to="/user">
            {button}
        </Link> : button);

}

const Header = (props) =>
    (<Toolbar style={{backgroundColor: Theme.palette.primary1Color}}>
        <ToolbarTitle><Link to="/">DHIS2</Link></ToolbarTitle>
        <ToolbarTitle align="center">
            <Link to="/">DHIS 2 App Store</Link>
        </ToolbarTitle>
        <ToolbarSection align="end">
            {renderProfileButton(props)}
        </ToolbarSection>
    </Toolbar>)

const mapStateTopProps = (state) => ({

    avatarImg: state.user.userInfo.info.picture,
    authenticated: state.user.userInfo.authenticated

})

export default connect(mapStateTopProps)(Header);
