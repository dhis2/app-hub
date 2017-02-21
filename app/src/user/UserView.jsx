import React, {Component} from 'react';
import {connect} from 'react-redux';
import Grid from '../material/Grid/Grid';
import Col from '../material/Grid/Col';
import Layout from 'react-toolbox/lib/layout/Layout';
import NavDrawer from 'react-toolbox/lib/layout/NavDrawer';
import Panel from 'react-toolbox/lib/layout/Panel';
import Navigation from 'react-toolbox/lib/navigation/Navigation';
import FontIcon from 'material-ui/FontIcon';
import Card from 'react-toolbox/lib/card/Card';
import {Link, Route} from 'react-router-dom';
import LinkTool from 'react-toolbox/lib/link/Link';
//import List from 'react-toolbox/lib/list/List';
//import ListItem from 'react-toolbox/lib/list/ListItem';
import {List, ListItem} from 'material-ui/List';
import AppUpload from './appUpload/AppUpload';
import AppList from './appList/AppList';
import {withReactRouterLink} from '../utils/RRHOC';

const RRListItem = withReactRouterLink(ListItem);

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
                                <i className="material-icons mdc-list-item__start-detail"
                                   aria-hidden="true">account_box</i>User Details
                            </a>
                            <a className="mdc-list-item" href="#">
                                <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">list</i>Apps
                            </a>
                            <a className="mdc-list-item" href="#">
                                <i className="material-icons mdc-list-item__start-detail"
                                   aria-hidden="true">file_upload</i>Upload
                            </a>
                        </nav>
                    </nav>
                </Col>
                <Col span={8}>
                    {card}
                </Col>

            </Grid>
        )
        console.log(this.props)
        const menu = (
            <div>
                <RRListItem to={this.props.match.url} primaryText="Apps"
                            leftIcon={<FontIcon className="material-icons">list</FontIcon>}/>
                <RRListItem to={this.props.match.url + "/upload"} primaryText="Upload"
                            leftIcon={<FontIcon className="material-icons">file_upload</FontIcon>}
                            className="customRouterList" activeClassName="customRouterListActive"/>
            </div>
        )
        console.log(menu)
        return (
            <Grid>
                <Col span={2}>
                    <List style={{padding: 0}}>
                        <Link to={this.props.match.url}>
                            <ListItem primaryText="Apps" leftIcon={<FontIcon className="material-icons">list</FontIcon>}/>
                        </Link>
                        <Link to={`${this.props.match.url}/upload`}>
                            <ListItem primaryText="Upload" leftIcon={<FontIcon className="material-icons">file_upload</FontIcon>}/>
                        </Link>

                    </List>
                </Col>
                <Col span={8}>
                    <Route exact path={`${this.props.match.url}`} component={AppList}>
                    </Route>
                    <Route path={`${this.props.match.url}/upload`} component={AppUpload}/>
                </Col>
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    appList: state.appsList.appList,
});

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, null)(UserView);

const old = (
    <div className="full-height">
        <div className="mdc-permanent-drawer">
            <div className="mdc-list-group">
                <nav className="mdc-list">
                    <a className="mdc-list-item mdc-permanent-drawer--selected" href="#">
                        <i className="material-icons mdc-list-item__start-detail" aria-hidden="true">account_box</i>User
                        Details
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
                <p className="mdc-typography--body1">It sits to the left of this content.It sits to the left of this
                    content.It sits to the left of this content.</p>
            </div>
        </div>
    </div>
)