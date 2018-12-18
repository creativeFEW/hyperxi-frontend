import { combineReducers } from "redux";
import users from "./users";
import auth from "./auth";
import invoices from "./invoices";

export default combineReducers({ auth, users, invoices });
