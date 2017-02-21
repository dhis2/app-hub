import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppCardItem from './AppCardItem';
import Grid from '../material/Grid/Grid';
import Col from '../material/Grid/Col';


class AppCards extends Component {
    render() {
        const cards = this.props.appList;
        if (!this.props.appList) {
            return null;
        }
        return (
            <Grid>
                {cards.map((app, i) => (
                    <Col key={i} span={3} align="middle" additionalClasses="center">
                        <AppCardItem app={app}/>
                    </Col>))}
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, null)(AppCards);