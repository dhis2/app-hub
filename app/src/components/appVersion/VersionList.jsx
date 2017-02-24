import React, {Component, PropTypes} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';

const VersionList = (props) => {

    const versions = props.versionList.sort((a,b) => b.created - a.created).map((version, i) => (
        <TableRow key={version.id}>
            <TableRowColumn>
                <a href={version.downloadUrl} title="Download">
                    <FontIcon className="material-icons">file_download</FontIcon>
                </a>
            </TableRowColumn>
            <TableRowColumn>{version.version}</TableRowColumn>
            <TableRowColumn>{version.minDhisVersion}</TableRowColumn>
            <TableRowColumn>{version.maxDhisVersion}</TableRowColumn>
            <TableRowColumn title={new Date(version.created).toLocaleString()}>
                {new Date(version.created).toLocaleDateString()}</TableRowColumn>
        </TableRow>
    ));

    return (
        <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>Download</TableHeaderColumn>
                    <TableHeaderColumn>Version</TableHeaderColumn>
                    <TableHeaderColumn>Min DHIS version</TableHeaderColumn>
                    <TableHeaderColumn>Max DHIS version</TableHeaderColumn>
                    <TableHeaderColumn>Uploaded</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {versions}
            </TableBody>
        </Table>
    )
}

VersionList.propTypes = {
    versionList: PropTypes.array.isRequired,
}

export default VersionList;
