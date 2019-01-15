import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Theme from "../../styles/theme";

/**
 * 
 * @param {} param0 
 */
export const ActiveLink = ({ children, to, activeOnlyWhenExact }) => (
    <Route
        path={to}
        exact={activeOnlyWhenExact}
        children={({ match }) => (
            <div
                style={
                    match ? (
                        { backgroundColor: Theme.menuItem.hoverColor }
                    ) : null
                }
            >
                <Link to={to}>{children}</Link>
            </div>
        )}
    />
);

export default ActiveLink;
