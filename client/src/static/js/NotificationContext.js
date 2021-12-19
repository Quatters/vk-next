import { createContext } from 'react';

const NotificationContext = createContext({
  showNotification: (errorCode, message, header) => {},
});

export default NotificationContext;
