import { useState } from "react";

export function useCheckLoggedIn() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginUser, setLoginUser] = useState("");
    // useEffect(() => {
        fetch(process.env.REACT_APP_ABASE_URL+`/api/user/checklogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}` 
            }
        })
        .then(async (response) => {
            if (response) {
                setIsLoggedIn(true);
                setLoginUser(response);
            } else {
                setIsLoggedIn(false);
                setLoginUser(JSON.stringify({name:""}));
            }
        })
    // }, []);
    return {isLoggedIn, loginUser};
}