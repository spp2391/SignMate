import { useEffect, useState } from "react";

export function useCheckLoggedIn() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginUser, setLoginUser] = useState("")
    useEffect(() => {
        fetch("http://localhost:8080/api/user/checklogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}` 
            }
        })
        .then((response) => response.text())
        .then((data) => {    
            if (data) {
                setIsLoggedIn(true);
                setLoginUser(data);
            }
        })
    }, []);
    return [isLoggedIn, loginUser];
}