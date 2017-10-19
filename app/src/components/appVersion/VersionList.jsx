import PropTypes from 'prop-types';
import React, { Component } from "react";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from "material-ui/Table";
import FontIcon from "material-ui/FontIcon";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";

const VersionList = props => {
    //Max 3 versions before "more button"
    const versions = props.versionList
        .sort((a, b) => b.created - a.created)
        .map((version, i) => {
            const editMenu = (
                <IconMenu
                    iconButtonElement={
                        <IconButton>
                            <FontIcon className="material-icons">
                                more_vert
                            </FontIcon>
                        </IconButton>
                    }
                >
                    <MenuItem
                        onClick={() => props.handleDelete(version)}
                        primaryText="Delete"
                    />
                </IconMenu>
            );

            return (
                <TableRow key={version.id}>
                    <TableRowColumn>
                        <a href={version.downloadUrl} title="Download">
                            <FontIcon className="material-icons">
                                file_download
                            </FontIcon>
                        </a>
                    </TableRowColumn>
                    <TableRowColumn>{version.version}</TableRowColumn>
                    <TableRowColumn>{version.minDhisVersion}</TableRowColumn>
                    <TableRowColumn>{version.maxDhisVersion}</TableRowColumn>
                    <TableRowColumn
                        title={new Date(version.created).toLocaleString()}
                    >
                        {new Date(version.created).toLocaleDateString()}
                    </TableRowColumn>
                    {props.editable ? (
                        <TableRowColumn>{editMenu}</TableRowColumn>
                    ) : null}
                </TableRow>
            );
        });

    return (
        <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn tooltip="Download URL">
                        Download
                    </TableHeaderColumn>
                    <TableHeaderColumn>Version</TableHeaderColumn>
                    <TableHeaderColumn>Min DHIS version</TableHeaderColumn>
                    <TableHeaderColumn>Max DHIS version</TableHeaderColumn>
                    <TableHeaderColumn>Uploaded</TableHeaderColumn>
                    {props.editable ? (
                        <TableHeaderColumn>Edit</TableHeaderColumn>
                    ) : null}
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>{versions}</TableBody>
        </Table>
    );
};

VersionList.propTypes = {
    versionList: PropTypes.array.isRequired,
    editable: PropTypes.bool,
    handleDelete: PropTypes.func
};
VersionList.defaultProps = {
    editable: false
};

export default VersionList;
