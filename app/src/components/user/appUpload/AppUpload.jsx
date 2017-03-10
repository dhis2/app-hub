import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, CardText} from 'material-ui/Card';
import UploadAppForm from '../../form/UploadAppForm';
import SubHeader from '../../header/SubHeader';
import {addApp} from '../../../actions/actionCreators';

class UserView extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(data) {
        this.props.addApp(data.data, data.file, data.image);

    }


    render() {
        return (
            <div>
                <SubHeader title="Upload app" backLink="/user"/>
                <Card>
                    <CardText>
                        <UploadAppForm submitted={this.handleSubmit.bind(this)}/>
                    </CardText>
                </Card>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({
    addApp(app, file, image) {
        dispatch(addApp(app, file, image))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(
    UserView);
