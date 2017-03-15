import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppCardItem from './AppCardItem';
import Grid from '../../material/Grid/Grid';
import Col from '../../material/Grid/Col';
import {loadAllApps, loadApprovedApps} from '../../actions/actionCreators';
import {TextFilter, filterApp, SelectFilter, filterAppType} from '../utils/Filters';
import { ToolbarGroup} from 'material-ui/Toolbar';
import {values, sortBy} from 'lodash';
import SubHeader from '../header/SubHeader';
import { Spinner } from '../utils/Loader';

class AppCards extends Component {

    componentDidMount() {
        this.props.loadApps();
    }

    render() {
        const filtersStyle = {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            margin: '0 auto 0 auto'
        }
        const filterElemStyle = {
            display: 'inline-flex',
            margin: '10px',
        }
        const {loading, byId : cards } = this.props.appList;
        const searchFilter = this.props.appSearchFilter ? this.props.appSearchFilter.values.searchFilter : '';
        const apps = sortBy(cards, ['name']).filter(app => filterApp(app, searchFilter) &&  filterAppType(app, this.props.filters))
            .map((app, i) => (
                <Col key={app.id} span={3} align="middle" additionalClasses="center">
                    <AppCardItem app={app}/>
                </Col>))

        return (
            <Grid>
                <Col span={12} style={{}}>
                    <SubHeader>
                        <ToolbarGroup>
                            <TextFilter hintText="Search"/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                        <SelectFilter
                            renderAllToggle
                            form="appTypeFilter"
                            style={filtersStyle}
                            elementStyle={filterElemStyle}
                            labelStyle={{width: '100%'}}
                            filters={[{label: 'Standard', toggled: true, value: 'APP_STANDARD'},
                                {label: 'Dashboard', toggled: true, value:'APP_DASHBOARD'},
                                {label: 'Tracker', toggled: true, value:'APP_TRACKER_DASHBOARD'}]}
                        />
                        </ToolbarGroup>
                    </SubHeader>
                </Col>
                {loading ? <Spinner size="large"/> : apps }
            </Grid>
        )
    }
}

const mapStateToProps = (state) => ({
    appList: state.appsList,
    filters: state.form.appTypeFilter,
    appSearchFilter: state.form.searchFilter,
});

const mapDispatchToProps = (dispatch) => ({
    loadApps() {
        dispatch(loadApprovedApps())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AppCards);