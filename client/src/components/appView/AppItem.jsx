import React from 'react'
import Col from '../material/Grid/Col'

const AppItem = props => (
    <Col span={4} align="top">
        {props.children}
    </Col>
)

export default AppItem
