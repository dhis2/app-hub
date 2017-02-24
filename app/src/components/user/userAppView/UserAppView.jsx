import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardText, CardTitle, CardHeader } from 'material-ui/Card';
import { Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { appLoad, openDialog } from '../../../actions/actionCreators';
import * as dialogType from '../../../constants/dialogTypes';
import VersionList from '../../appVersion/VersionList';

class UserAppView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadApp({appId: this.props.match.params.appId})
    }

    handleOpenDialog() {
        this.props.openDialog(this.props.app);
    }

    render() {
        console.log(this.props)
        const app = this.props.app;
        if(!app) {
            return null;
        }
        const FABStyle = {
            margin: 0,
            top: 0,
            right: 10,
            top: '-25px',
            position: 'absolute',
        };
        return (
            <div>
                <Toolbar style={{backgroundColor: 'white', marginBottom: '10px'}}>
                    <ToolbarGroup>
                        <ToolbarTitle text="App Overview"/>
                    </ToolbarGroup>

                </Toolbar>
                <Card>
                    <CardHeader title={app.name} avatar={"https://avatars1.githubusercontent.com/u/13482715?v=3&s=400"}
                    subtitle={app.developer.name}>

                    </CardHeader>
                    <CardText>
                        {app.description}
                    </CardText>

                </Card>
                <Card style={{marginTop: '10px', position: 'relative'}}>
                    <FloatingActionButton mini={true} style={FABStyle} onTouchTap={this.handleOpenDialog.bind(this)}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <CardTitle title="Versions" />
                    <CardText>
                        <VersionList versionList={app.versions}/>
                    </CardText>
                </Card>
            </div>
        )
    }
}

UserAppView.propTypes = {

}

const mapStateToProps = (state, ownProps) => ({
   app: state.user.appList[ownProps.match.params.appId]
})

const mapDispatchToProps = (dispatch) =>  ({
    loadApp(appid) {
        dispatch(appLoad(appid));
    },

    openDialog(dialogProps) {
        dispatch(openDialog(dialogType.NEW_VERSION, dialogProps))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(UserAppView);