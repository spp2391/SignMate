import "./Header.css";
import { useEffect, useState } from "react";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginId, setLoginId] = useState("");
    // 페이지에 진입했을 때 로그인 상태 확인 및 아이디 조정

    // 로그인 상태가 변경되었을 때 로그인 상태 확인 및 아이디 조정
    // 아이디가 변경되었을 때 로그인 상태 확인 및 아이디 조정

    useEffect(() => {
        checkLoggedIn();
    },[])

    const checkLoggedIn = () => {
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
                setLoginId(data);
            }
        })
    }

    if (isLoggedIn) {
        return (
            <div className="container">
                {loginId} logout
            </div>
        )
    } else {
        return (
            <div className="container">
                join login
            </div>
        )
    }
}
export default Header;