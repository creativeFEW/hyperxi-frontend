import { createSelector } from 'reselect';
import map from 'lodash/map';

const users = (state) => state.users;

export const getUsers = createSelector(
  [ users ],
  (users) => {
    return map(users.userList, user => {
      return {
        ...user,
        displayName: user.companyName ? user.companyName : user.firstName + ' ' + user.lastName
      }
    });
  }
);