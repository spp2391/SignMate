import { useState } from "react";
import "./login.css";

const LoginInputArea = () => {
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
        .then((response) =>
            response.text()
        )
        .then(text=>{
            localStorage.setItem("accessToken", text);
        })
    }
    const handleKakaoLogin = () => {
        fetch("http://localhost:8080/login/oauth2/code/kakao", {
            method: "POST",
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
    const handleGoogleLogin = () => {
        fetch("http://localhost:8080/login/oauth2/code/google", {
            method: "POST",
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
        fetch("http://localhost:8080/login/oauth2/code/naver", {
            method: "POST",
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
                            type="pw"
                            value={state.pw}
                            onChange={handleChangePw}
                            placeholder="password"
                        />
                    </div>
                    {/* <p>{state.status}</p>
                    <p>{state.id}, {state.pw}</p> */}
                    {/* <button onClick={handleJoin}>Join</button> */}
                    <button onClick={handleLogin} className="login-btn">Submit</button>
                    <button className="kakao-btn" onClick={handleKakaoLogin}>Kakao</button>
                    <a href="http://localhost:8080/login/oauth2/code/kakao" className="kakao-btn">Kakao</a>
                    <button className="google-btn" onClick={handleGoogleLogin}>Google</button>
                    <button className="naver-btn" onClick={handleNaverLogin}>Naver</button>
                </div>
            </div>     
        </div>
    )
}
export default LoginInputArea;