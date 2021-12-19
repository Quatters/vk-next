import { createContext } from 'react';

const CurrentUserContext = createContext({
  currentUser: null,
  refreshCurrentUser: limit => {},
});

export default CurrentUserContext;
