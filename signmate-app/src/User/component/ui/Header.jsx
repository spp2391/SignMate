import { useState } from "react";

const Footer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // 페이지에 진입했을 때 로그인 상태 확인 및 아이디 조정

    // 로그인 상태가 변경되었을 때 로그인 상태 확인 및 아이디 조정
    // 아이디가 변경되었을 때 로그인 상태 확인 및 아이디 조정

    const checkLoggedIn = () => {
        return sessionStorage.getItem("userId")!=null, sessionStorage.getItem("userId");
    }

    if (isLoggedIn) {

    } else {

    }
    return (
        <div>
            
        </div>
    )
}
export default Footer;