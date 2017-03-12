import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppCardItem from './AppCardItem';
import Grid from '../../material/Grid/Grid';
import Col from '../../material/Grid/Col';
import { loadAllApps, loadApprovedApps } from '../../actions/actionCreators';
import { values } from 'lodash';
import SubHeader from '../header/SubHeader';

class AppCards extends Component {

    componentDidMount() {
        this.props.loadApps();
    }
    render() {
        const cards = this.props.appList;
        if (!this.props.appList) {
            return null;
        }
        return (
            <Grid>
                <Col span={12} style={{}}>
                <SubHeader/>
                </Col>
                {values(cards).map((app, i) => (
                    <Col key={app.id} span={3} align="middle" additionalClasses="center">
                        <AppCardItem app={app}/>
                    </Col>))}
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({
    loadApps() {
        dispatch(loadApprovedApps())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AppCards);