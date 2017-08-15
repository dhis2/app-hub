import React, { Component } from "react";
import { connect } from "react-redux";
import AppCardItem from "./AppCardItem";
import Grid from "../../material/Grid/Grid";
import Col from "../../material/Grid/Col";
import { loadAllApps, loadApprovedApps } from "../../actions/actionCreators";
import {
    TextFilter,
    filterApp,
    SelectFilter,
    filterAppType
} from "../utils/Filters";
import { ToolbarGroup } from "material-ui/Toolbar";
//import {values, sortBy} from 'lodash';
import sortBy from "lodash/sortBy";
//import values from 'lodash/values';
import SubHeader from "../header/SubHeader";
import ErrorOrLoading from "../utils/ErrorOrLoading";
import { FadeAnimation, FadeAnimationList } from "../utils/Animate";
import "../../styles/utils/animations.scss";
import Theme from "../../styles/theme";
class AppCards extends Component {
    componentDidMount() {
        this.props.loadApps();
    }

    render() {
        const styles = {
            grid: {
                padding: 0
            },
            filters: {
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                width: "auto",
                margin: "0 auto 0 auto"
            },
            filterElem: {
                display: "inline-flex",
                margin: "10px",
                width: "auto"
            },
            appItem: {
            },

            emptyApps: {
                textAlign: "center"
            }
        };
        const { loading, loaded, error, byId: cards } = this.props.appList;
        const loadOrErr = loading || error;
        const searchFilter = this.props.appSearchFilter
            ? this.props.appSearchFilter.values.searchFilter
            : "";

        //filter and construct appcards
        const apps = sortBy(cards, ["name"])
            .filter(
                app =>
                    filterApp(app, searchFilter) &&
                    filterAppType(app, this.props.filters)
            )
            .map((app, i) =>
                <Col key={app.id} span={3} phone={4} style={styles.appItem}>
                    <AppCardItem key={app.id} app={app} />
                </Col>
            );

        const emptyApps = (
            <FadeAnimation appear>
            <Col align="middle" span={12} style={styles.emptyApps}>
                <p>We couldn't find any apps.</p>
            </Col>
            </FadeAnimation>
        );
        return (
            <Grid>
                <Col span={12} style={{}}>
                    <SubHeader style={{ marginBottom: 0 }}>
                        <ToolbarGroup>
                            <TextFilter hintText="Search" />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <SelectFilter
                                form="appTypeFilter"
                                style={styles.filters}
                                elementStyle={styles.filterElem}
                                labelStyle={{ width: "auto" }}
                                filters={[
                                    {
                                        label: "Standard app",
                                        toggled: true,
                                        value: "APP_STANDARD"
                                    },
                                    {
                                        label: "Dashboard app",
                                        toggled: true,
                                        value: "APP_DASHBOARD"
                                    },
                                    {
                                        label: "Tracker widget",
                                        toggled: true,
                                        value: "APP_TRACKER_DASHBOARD"
                                    }
                                ]}
                            />
                        </ToolbarGroup>
                    </SubHeader>
                </Col>
                <Col span={12}>
                    {loadOrErr || !apps
                        ? <ErrorOrLoading
                              loading={loading}
                              error={error}
                              retry={this.props.loadApps}
                          />
                        : <FadeAnimationList
                              component={Grid}
                              nested
                              nestedStyle={styles.grid}
                              exit={false}
                          >
                              {apps}
                          </FadeAnimationList>}
                    {loaded && apps.length < 1 && emptyApps}
                </Col>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    appList: state.appsList,
    filters: state.form.appTypeFilter,
    appSearchFilter: state.form.searchFilter
});

const mapDispatchToProps = dispatch => ({
    loadApps() {
        dispatch(loadApprovedApps());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppCards);
