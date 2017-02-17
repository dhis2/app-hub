import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppItem from './AppCardItem';
import Grid from '../material/Grid/Grid';



class AppCards extends Component {
    render() {
        const cards = this.props.appList;
        if(!this.props.appList ) {
            return null;
        }
        return (
            <Grid >
                {cards.map((app,i) => (<AppItem key={i} app={app}></AppItem>))}
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps,null)(AppCards);