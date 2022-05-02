import React, { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = React.createContext({
    user: null,
    setUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
    children: PropTypes.node.isRequired,
};

const defaultProps = {
    user: null,
};

export function AuthProvider({ user: initialUser, children }) {
    const [user, setUser] = useState(initialUser);

    const value = useMemo(
        () => ({
            user,
            setUser,
        }),
        [user, setUser],
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = propTypes;
AuthProvider.defaultProps = defaultProps;

export default AuthContext;
