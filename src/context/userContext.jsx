import { createContext, useReducer } from 'react';

const UserContext = createContext();

const initialValues = {
    isLogin: false,
    token: '',
    name: '',
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return {
                ...state,
                isLogin: action.payload.status,
                token: action.payload.token,
                name: action.payload.nickname,
            };

        case 'USER_LOGOUT':
            return {
                isLogin: false,
                token: '',
                name: '',
            };

        default:
            return state;
    }
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialValues);

    const handleUserLogin = (value) => {
        dispatch({
            type: 'USER_LOGIN',
            payload: value,
        });
    };

    const handleUserLogout = () => {
        dispatch({
            type: 'USER_LOGOUT',
        });
    };

    const defaultValues = {
        state,
        handleUserLogin,
        handleUserLogout,
    };

    return <UserContext.Provider value={defaultValues}>{children}</UserContext.Provider>;
};

export default UserContext;
