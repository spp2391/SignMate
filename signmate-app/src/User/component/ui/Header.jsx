import { useState } from "react";

const Footer = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginId, setLoginId] = useState("");
    // 페이지에 진입했을 때 로그인 상태 확인 및 아이디 조정

    // 로그인 상태가 변경되었을 때 로그인 상태 확인 및 아이디 조정
    // 아이디가 변경되었을 때 로그인 상태 확인 및 아이디 조정

    const checkLoggedIn = () => {
        fetch("http://localhost:8080/api/user/checklogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {    
            if (response) {
                setIsLoggedIn(true);
                setLoginId(response);
            }
        })
    }

    if (isLoggedIn) {
        return (
            <div>
                <table>
                    <tr>
                        <td>{loginId}</td>
                        <td>logout</td>
                    </tr>
                </table>
            </div>
        )
    } else {
        return (
            <div>
                <table>
                    <tr>
                        <td>join</td>
                        <td>login</td>
                    </tr>
                </table>
            </div>
        )
    }
}
export default Footer;