import React, {PropTypes} from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarTitle, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import {Link} from 'react-router-dom';

const SubHeader = (props) => {

    return (
        <Toolbar style={{backgroundColor: 'white', marginBottom: '10px'}}>
            <ToolbarGroup>
                {props.backLink ? <Link to={props.backLink}>
                        <IconButton>
                            <FontIcon className="material-icons">arrow_back</FontIcon>
                        </IconButton>

                    </Link> : null}
                {props.backLink ? <ToolbarSeparator style={{marginRight: '24px'}}/> : null}
                <ToolbarTitle text={props.title}/>
            </ToolbarGroup>
            {props.children}
        </Toolbar>)
}

SubHeader.propTypes = {
    title: PropTypes.string,
    backLink: PropTypes.string,
}
export default SubHeader;

