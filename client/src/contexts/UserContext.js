import { createContext } from "react";
const UserContext = createContext({ 
    user: null, 
    setUser: () => {},
    isStaff: false,
    setIsStaff: () => {},
 });
export default UserContext;
