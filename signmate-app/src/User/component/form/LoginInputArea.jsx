import { useEffect, useState } from "react";
import "./login.css";
import { useLocation, useNavigate } from "react-router-dom";

const LoginInputArea = () => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(()=>{
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');  // 'react'
        if(token){
            localStorage.setItem("accessToken", token);
        }
    },[])
    const [state, setState] = useState(
        {
            id: "",
            pw: "",
            status: "Status"
        }
    )
    const handleChangeId = (event) => {
        setState({
            ...state,
            id: event.target.value,
        })
    }
    const handleChangePw = (event) => {
        setState({
            ...state,
            pw: event.target.value,
        })
    }
    const handleLogin = (event) => {
        event.preventDefault();
        const loginRequest = {
            email: state.id,
            password: state.pw
        }
        fetch("http://localhost:8080/api/user/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginRequest),
        })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            response.text()
        }
        )
        .then(text=>{
            localStorage.setItem("accessToken", text);
            alert("로그인 되었습니다.");
            navigate("/");
        })
        .catch((e) => {
            alert(e.message);
            // console.log(e.message);
        })
    }
    // const handleKakaoLogin = () => {
    //     fetch("/oauth2/authorization/kakao", {
    //         method: "GET",
    //         credentials: "include",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //     .then((response) =>
    //         response.json()
    //     )
    //     .then(text=>{
    //         localStorage.setItem("accessToken", text);
    //     })
    //     .catch(e => {
    //         alert(e);
    //     })
    // }
    const handleGoogleLogin = () => {
        fetch("/oauth2/authorization/google", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) =>
            response.text()
        )
        .then(text=>{
            localStorage.setItem("accessToken", text);
        })
    }
    const handleNaverLogin = () => {
        fetch("/oauth2/authorization/naver", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) =>
            response.text()
        )
        .then(text=>{
            localStorage.setItem("accessToken", text);
        })
    }
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    Login
                </div>
                <div>
                    <div className="tab-menu">
                        아이디/패스워드를 입력해주세요.
                    </div>
                    <div className="input-group">
                        <input
                            type="id"
                            value={state.id}
                            onChange={handleChangeId}
                            placeholder="email"
                        />
                        <input
                            type="password"
                            value={state.pw}
                            onChange={handleChangePw}
                            placeholder="password"
                        />
                    </div>
                    {/* <p>{state.status}</p>
                    <p>{state.id}, {state.pw}</p> */}
                    {/* <button onClick={handleJoin}>Join</button> */}
                    <button onClick={handleLogin} className="login-btn">Submit</button>
                    {/* <button className="kakao-btn" onClick={handleKakaoLogin}>Kakao</button> */}
                    <a href="http://localhost:8080/oauth2/authorization/kakao" className="kakao-btn">Kakao</a>
                    <button className="google-btn" onClick={handleGoogleLogin}>Google</button>
                    <button className="naver-btn" onClick={handleNaverLogin}>Naver</button>
                </div>
            </div>     
        </div>
    )
}
export default LoginInputArea;