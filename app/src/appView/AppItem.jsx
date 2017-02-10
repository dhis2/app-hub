import React from 'react';
import 'material-components-web/dist/material-components-web.css';



const AppItem = (props) => (
        <div className="mdc-layout-grid__cell">
            {props.children}
        </div>
    )


export default AppItem;