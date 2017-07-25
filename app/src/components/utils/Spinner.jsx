import React, { PropTypes, Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';


const styles = {
    outer: {
        width: '65px',
        height: '65px',
        viewBox: '0 0 66 66'
    },
    path: {
        fill: 'none',
        strokeWidth: '6',
        strokeLinecap: 'round',
        cx: '33',
        cy: '33',
        r: '30',
    }
}


export const Spinner = (props) => (
    <SvgIcon className="spinner" {...styles.outer} style={props.style} xmlns="http://www.w3.org/2000/svg">
        <circle className="path" {...styles.path}></circle>
    </SvgIcon>
)


Spinner.propTypes = {
    style: PropTypes.object,
    innerStyle: PropTypes.object,

}

export default Spinner;