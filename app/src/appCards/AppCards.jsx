import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppItem from './AppCardItem';
import Grid from '../material/Grid/Grid';



class AppCards extends Component {
    render() {
        console.log(this.props)
        const card = (<div className="mdc-card">
            <section className="mdc-card__primary">
                <h1 className="mdc-card__title mdc-card__title--large">Title goes here</h1>
                <h2 className="mdc-card__subtitle">Subtitle here</h2>
            </section>
            <section className="mdc-card__supporting-text">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
            </section>

        </div>)
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