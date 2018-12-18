import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Centered from '../styles/centered.style';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import mq from '../styles/mediaQuery';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import isBefore from 'date-fns/is_before'
import format from 'date-fns/format'
import { connect } from "react-redux";
import { login, logout } from "../redux/actions/auth.actions";
import { withRouter } from "react-router-dom";

const StyledPaper = styled(Paper)`
  padding: 12px;
  width: 100%;
  margin: 20px;
   ${mq.sm`max-width: 300px; margin: 0`}
`;

const Login = class Login extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
    loggedInMsg: null
  };
  onChangePassword = (e) => {
    this.setState({
      password: e.target.value
    });
  };
  onChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    });
  };
  onSubmit = async () => {
    this.props.login(
      {
        email: this.state.email,
        password: this.state.password,
        history: this.props.history
      }
    );
  };
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.onSubmit();
    }
  };
  logout = () => {
    this.props.logout({history: this.props.history}
    );
  };

  componentDidMount() {
    if (localStorage.getItem('token') && isBefore(new Date(), localStorage.getItem('tokenExp'))) {
      this.setState({loggedInMsg: "You are already logged in. Token Expires " + format(localStorage.getItem('tokenExp'), 'MMMM Do, YYYY')});
    }
  }

  render() {
    return (
      <Centered>
        <Grid container
              alignItems="center"
              justify="center">
          <StyledPaper>
            <Typography component="h1" variant="h5" gutterBottom={true}>HyperXi Login</Typography>
            <TextField onKeyPress={this.handleKeyPress} type="email" value={this.state.email}
                       onChange={this.onChangeEmail} required={true}
                       margin="normal" fullWidth autoFocus label="Email"/>
            <TextField onKeyPress={this.handleKeyPress} type="password" value={this.state.password}
                       onChange={this.onChangePassword}
                       required={true} margin="normal" fullWidth label="Password"/>
            <Button style={{margin: '20px 0'}} onClick={this.onSubmit} variant="contained"
                    color="primary">Login{this.props.authLoading &&
            <CircularProgress style={{margin: '0 0 0 10px'}} color="inherit" size={16}/>}</Button>
            <Typography component="p" variant="body1" gutterBottom={true}>{this.state.loggedInMsg}</Typography>
            <Button size="small" variant="outlined" component="span">
              Go
            </Button>
            <Button onClick={this.logout} style={{margin: '0 0 0 10px'}} size="small" variant="outlined"
                    component="span">
              Logout
            </Button>
          </StyledPaper>
        </Grid>
      </Centered>
    );
  }
};

const mapStateToProps = state => {
  return {
    authLoading: state.auth.loading
  };
};

export default withRouter(connect(mapStateToProps, {login, logout})(Login));