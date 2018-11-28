import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import React, {Component} from 'react';
class Form extends Component {

    state = {
        invoice: this.props.invoice,
        users: this.props.users,
        ui: {
            client: false
        }
    };

    componentDidMount() {
        console.log('DEBUG', this.props);
    }

    onModifyUi = (type, open) => {
        this.setState(state => {
            const o = {...state.ui};
            o[type] = open;
            return {ui: o};
        });
    };

    handleChange = (value, target) => {
        this.setState(state => {
            const o = {...state};
            o[target] = value;
            return o;
        });
    };

    render() {
        return (
            <form autoComplete="off" noValidate>
                <FormControl>
                    <InputLabel>Client</InputLabel>
                    <Select
                        open={this.state.ui.client}
                        onClose={() => {this.onModifyUi('client', false)}}
                        onOpen={() => {this.onModifyUi('client', true)}}
                        value={this.state.invoice.user.id}
                        onChange={(e) => {
                            this.handleChange(e.target.value, 'client')
                        }}
                        inputProps={{name: 'client'}}
                        >
                        {this.state.users.map(user => (
                            <MenuItem key={user.id} value={user.id}>{user.companyName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </form>
        )
    }
}

export default Form