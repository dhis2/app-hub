import React, {Component} from 'react';
import {connect} from 'react-redux';
import Grid from '../material/Grid/Grid';
import Col from '../material/Grid/Col';


class UserView extends Component {
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
        if (!this.props.appList) {
            return null;
        }
        const old = (
            <Grid additionalClasses="paper">
                <Col span={1}>
                    <nav className="mdc-permanent-drawer mdc-typography">
                        <nav id="icon-with-text-demo" className="mdc-list">
                            <a className="mdc-list-item mdc-permanent-drawer--selected" href="#">
                                <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">account_box</i>User Details
                            </a>
                            <a className="mdc-list-item" href="#">
                                <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">list</i>Apps
                            </a>
                            <a className="mdc-list-item" href="#">
                                <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">file_upload</i>Upload
                            </a>
                        </nav>
                    </nav>
                </Col>
                <Col span={8}>
                    {card}
                </Col>

            </Grid>
        )
        return (
            <div className="full-height">
                <div className="mdc-permanent-drawer">
                    <div className="mdc-list-group">
                        <nav className="mdc-list">
                            <a className="mdc-list-item mdc-permanent-drawer--selected" href="#">
                                <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">account_box</i>User Details
                            </a>
                            <a className="mdc-list-item" href="#">
                                <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">list</i>Apps
                            </a>
                            <a className="mdc-list-item" href="#">
                                <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">file_upload</i>Upload
                            </a>
                        </nav>


                    </div>
                </div>
                <div additionalClasses="">
                    <div className="left-margin">
                    <h1 className="mdc-typography--display1">Permanent Drawer</h1>
                    <p className="mdc-typography--body1">It sits to the left of this content.It sits to the left of this content.It sits to the left of this content.</p>
                    </div>
                </div>
            </div>
    )
    }
}

const mapStateToProps = (state) => ({
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, null)(UserView);