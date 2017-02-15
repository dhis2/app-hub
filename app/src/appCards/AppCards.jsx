import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppItem from './AppCardItem';
import Grid from '../material/Grid/Grid';

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
    <section className="mdc-card__actions">
        <button className="mdc-button mdc-button--compact mdc-card__action">Action 1</button>
        <button className="mdc-button mdc-button--compact mdc-card__action">Action 2</button>
    </section>
</div>)


class AppView extends Component {
    render() {
        const cards = new Array(4).fill(card);
        return (
            <Grid >
                {cards.map((c,i) => (<AppItem key={i}>{c}</AppItem>))}
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

})

export default connect(null,null)(AppView);