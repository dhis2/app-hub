import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FontIcon from 'material-ui/FontIcon'

const styles = {
    containerStyle: {
        backgroundColor: '#f5fbff',
        margin: 0,
        border: '1px solid #d3e9fc',
        borderRadius: '3px',
        padding: '8px'
    },
    blockQuoteContainer: {
      //  lineHeight: '1.2rem',
        marginTop: 0,
    },
    iconHeader: {
        display: 'flex',
        alignItems: 'center'
    },
    iconStyle: {
        fontSize: '24px',
        padding: '4px',
        marginRight: '8px'
    },
}
export const NoteBlock = props => (
    <div style={{ ...styles.containerStyle, ...props.styles }}>
        <div style={styles.iconHeader}>
            <FontIcon style={styles.iconStyle} className="material-icons">
                info_outline
            </FontIcon>
            {props.header || <b>Note</b>}
        </div>
    <blockquote style={styles.blockQuoteContainer}> 
        {props.children}
    </blockquote>
    </div>
)

NoteBlock.propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
}

export default NoteBlock
