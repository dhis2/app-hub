import React from 'react';
import Toolbar from '../../material/Toolbar/Toolbar';
import ToolbarSection from '../../material/Toolbar/ToolbarSection';
import ToolbarTitle from '../../material/Toolbar/ToolbarTitle';
import { getAuth } from '../../utils/AuthService';
import { Link } from 'react-router-dom';
const Header = (props) => (
    (<Toolbar>
        <ToolbarTitle><Link to="/">DHIS2</Link></ToolbarTitle>
        <ToolbarTitle align="center">
            <Link to="/">AppStore</Link>
        </ToolbarTitle>
        <ToolbarSection align="end">
            <i onClick={() => getAuth().login()} className="material-icons">account_circle</i>
        </ToolbarSection>
    </Toolbar>)

)

export default Header;