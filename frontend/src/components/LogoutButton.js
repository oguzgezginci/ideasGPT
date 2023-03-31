import { useAuth0 } from "@auth0/auth0-react";
import { React, useContext } from 'react'
import AuthContext from "./AuthContext";




function LogoutButton() {
  
  
  
    const { logout, isAuthenticated } = useAuth0()
    const {setUserID } = useContext(AuthContext);

    const logoutUser = async () => {

        logout();
        setUserID(null);

    }
  

  return (

    isAuthenticated && (
        <button onClick={() => logoutUser()}>
            Sign Out
        </button>
    )
  )
}

export default LogoutButton