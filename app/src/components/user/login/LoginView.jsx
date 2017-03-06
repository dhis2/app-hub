import React, {Component, PropTypes} from 'react';
import Grid from '../../../material/Grid/Grid';
import Col from '../../../material/Grid/Col';
import FontIcon from 'material-ui/FontIcon';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
class LoginView extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin() {
        window.location="http://localhost:3099/login"
    }

    render() {
        const colStyle = {
            margin: '20px auto 0 auto'
        }
        return (
            <Grid>
                <Col style={colStyle} span={4} >
                    <Card style={colStyle}>
                        <CardTitle title="Login"/>
                        <RaisedButton primary={true}
                                      onClick={this.handleLogin}
                                      fullWidth label="Login"/>
                    </Card>
                </Col>
            </Grid>
        )
    }
}

export default LoginView;