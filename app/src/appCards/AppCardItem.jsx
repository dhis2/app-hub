import React from 'react';
import Col from '../material/Grid/Col';


const AppItem = (props) => (
            <Col align="top">
                {props.children}
            </Col>
    );

export default AppItem;