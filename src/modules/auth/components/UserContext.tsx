import React, {useContext} from 'react';
import User from '../../../models/user';

const UserContext = React.createContext<User | null>(null);

const useUserContext = () => useContext(UserContext);

export {UserContext, useUserContext};
