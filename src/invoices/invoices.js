import React, { Component } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Api from "../api";

const El = styled.div`

`;



class Row extends Component {

  state = {
    menuOpen: false,
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ menuOpen: true, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ menuOpen: false });
  };

  render() {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Single-line item"
          secondary="Secondary text"
        />
        <ListItemSecondaryAction>
          <IconButton onClick={this.handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.menuOpen}
            onClose={this.handleClose}
            PaperProps={{
              style: {
                width: 200,
              },
            }}
          >
            <MenuItem key={1} onClick={this.handleClose}>
              {this.props.test}
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>

    )
  }
}

class Invoices extends Component {

  async componentDidMount() {
    console.log('Invoices');
    const response = await Api.axios.get(`/invoice${this.props.location.search}`);
    console.log(response);
  }

  render() {
    return (
      <El style={this.props.style} className="Invoices">
        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            <List dense>
              <Row test="one"/>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            Right col
          </Grid>
        </Grid>
      </El>
    );
  }
}


export default Invoices;
