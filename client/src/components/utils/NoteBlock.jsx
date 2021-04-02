import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React from 'react'

const styles = {
    containerStyle: {
        backgroundColor: '#f5fbff',
        margin: 0,
        border: '1px solid #d3e9fc',
        borderRadius: '3px',
        padding: '8px',
    },
    blockQuoteContainer: {
        //  lineHeight: '1.2rem',
        marginTop: 0,
    },
    iconHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    iconStyle: {
        fontSize: '24px',
        padding: '4px',
        marginRight: '8px',
    },
    warningContainerStyle: {
        backgroundColor: '#ffecb3',
        border: '1px solid #ffe082',
    },
    criticalContainerStyle: {
        backgroundColor: '#e57373',
        border: '1px solid #f44336',
    },
}
export const NoteBlock = props => (
    <div
        style={{
            ...styles.containerStyle,
            ...props.styles,
            ...(props.warning && styles.warningContainerStyle),
            ...(props.critical && styles.criticalContainerStyle),
        }}
    >
        <div style={styles.iconHeader}>
            <FontIcon style={styles.iconStyle} className="material-icons">
                {props.icon || 'info_outline'}
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
    icon: PropTypes.string,
    warning: PropTypes.bool,
}

export default NoteBlock
