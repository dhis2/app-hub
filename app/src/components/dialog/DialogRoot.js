import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as dialogTypes from '../../constants/dialogTypes';
import NewAppVersionDialog from './NewAppVersionDialog';


const DialogComponents = {};
DialogComponents[dialogTypes.NEW_VERSION] = NewAppVersionDialog;
DialogComponents[dialogTypes.CONFIRM_DELETE_APP] = null;
DialogComponents[dialogTypes.EDIT_APP] = null;


class DialogRoot extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {dialogType, dialogProps} = this.props;
        if (!dialogType) {
            return null;
        }
        const DialogType = DialogComponents[dialogType];
        return DialogType ? (
                <DialogType dialogProps={dialogProps}/>
        ) : null;
    }
}

DialogRoot.propTypes = {
    dialogType: PropTypes.string,
};

const mapStateToProps = state => ({
    dialogType: state.dialog.dialogType,
    dialogProps: state.dialog.dialogProps,
});

export default connect(
    mapStateToProps
)(DialogRoot);
