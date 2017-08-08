import React, { Component } from "react";
import { connect } from "react-redux";
import { Card, CardText } from "material-ui/Card";
import UploadAppFormStepper from "../../form/UploadAppFormStepper";
import SubHeader from "../../header/SubHeader";
import { addApp } from "../../../actions/actionCreators";
import Theme from "../../../styles/theme";

class AppUpload extends Component {
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
                <SubHeader title="Upload app" backLink="/user" />
                <Card style={Theme.paddedCard}>
                    <CardText>
                        <UploadAppFormStepper
                            submitted={this.handleSubmit.bind(this)}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    appList: state.appsList.appList
});

const mapDispatchToProps = dispatch => ({
    addApp(app, file, image) {
        dispatch(addApp(app, file, image));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppUpload);
