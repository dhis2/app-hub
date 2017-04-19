import React from 'react';
import Toolbar from '../../material/Toolbar/Toolbar';
import ToolbarSection from '../../material/Toolbar/ToolbarSection';
import ToolbarTitle from '../../material/Toolbar/ToolbarTitle';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {getAuth} from '../../utils/AuthService';
import {Link} from 'react-router-dom';
import Theme from '../../styles/theme';

const renderProfileButton = (isLoggedIn) => {
    const button = (<IconButton onClick={() => !isLoggedIn ? getAuth().login() : {}}>
        <FontIcon color="white" className="material-icons">account_circle</FontIcon>
    </IconButton>)
    return (isLoggedIn ? <Link to="user">
            {button}
        </Link> : button);

}

const Header = (props) =>
    (<Toolbar style={{backgroundColor: Theme.palette.primary1Color}}>
        <ToolbarTitle><Link to="/">DHIS2</Link></ToolbarTitle>
        <ToolbarTitle align="center">
            <Link to="/">AppStore</Link>
        </ToolbarTitle>
        <ToolbarSection align="end">
            {renderProfileButton(getAuth().isLoggedIn())}
        </ToolbarSection>
    </Toolbar>)


export default Header;