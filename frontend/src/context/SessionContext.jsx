import React, {
  createContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';

const SessionContext = createContext();
function SessionProvider({ children }) {
  const [token, setToken] = useState(null);

  const refreshToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  };

  const data = {
    token,
    refreshToken,
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return <SessionContext.Provider value={data}>{children}</SessionContext.Provider>;
}

export { SessionProvider };
export default SessionContext;

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
