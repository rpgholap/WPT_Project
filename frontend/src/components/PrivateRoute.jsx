import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/TokenService";
import { getRole } from "../services/RoleService";
import { AccessDenied } from "./AccessDenied";

export function PrivateRoute(props){
    const { allowedRoles } = props;
    const token = getToken();
    const role = parseInt(getRole());

    if(token){
        if(allowedRoles.includes(role)){
            return <Outlet/>
        }
        else{
            return <AccessDenied/>
        }
        
        // send user on the desired component
    }
    else{
        // redirect a user on login page
        return <Navigate to={"/login"} />
    }
}