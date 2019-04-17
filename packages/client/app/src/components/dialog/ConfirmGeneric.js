import React, { PropTypes, Component } from 'react'
import DialogBase from './DialogBase'

const ConfirmGenericDialog = props => {
    return (
        <DialogBase
            approveAction={props.approveAction}
            approveLabel={'Delete'}
            contentStyle={{ maxWidth: '400px' }}
        >
            {props.children}
        </DialogBase>
    )
}

ConfirmGenericDialog.propTypes = {
    approveLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    approveAction: PropTypes.func.isRequired,
}

export default ConfirmGenericDialog
