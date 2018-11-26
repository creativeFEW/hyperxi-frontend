import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Login from './login/Login.component';
import Api from './api';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Row from './row/row';

class App extends Component {

    state = {
        message: '',
        open: false
    };

    componentDidMount() {
        Api.axios.interceptors.response.use(response => response, error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                this.setState({open:true, message: error.response.data.message});
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
                this.setState({open:true, message: 'No response from server'});
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        });
    }

    handleClose = () => {
        this.setState({open: false})
    };

    render() {
        return (
            <React.Fragment>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    message={<span><ErrorIcon style={{verticalAlign: 'middle', marginRight: 10}}/>{this.state.message}</span>}
                    onClose={this.handleClose}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                    />
                <Router>
                    <Route path={`/`} exact component={Login}/>
                </Router>
                <Row/>
            </React.Fragment>
        );
    }
}

export default App;
