import { useState } from "react";

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
    const handleJoin = (event) => {
        event.preventDefault();
        const joinRequest = {
            email: state.id,
            password: state.pw,
            name: state.id,
            nickname: state.id,
            companyName: "ABC",
            userType: "USER",
            userRole: "COMPANY"
        }
        fetch("http://localhost:8080/api/user/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(joinRequest),
        })
        .then((response) => response.json())
        .then((data) => setState({
            status: data
        }))
    }
    const handleLogin = (event) => {
        event.preventDefault();
        const loginRequest = {
            email: state.id,
            password: state.pw
        }
        fetch("http://localhost:8080/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "crossDomain": true,
                "xhrFields":{
                    "withCredentials": true
                }
            },
            body: JSON.stringify(loginRequest),
        })
        .then((response) => response.json())
        .then((data) => setState({
            status: data
        }))
    }
    const handleKakaoLogin = () => {

    }
    const handleGoogleLogin = () => {

    }
    return (
        <div>
            <h1>Login</h1>
            <input
                type="id"
                value={state.id}
                onChange={handleChangeId}
            />
            <input
                type="pw"
                value={state.pw}
                onChange={handleChangePw}
            />
            <p>{state.status}</p>
            <p>{state.id}, {state.pw}</p>
            <button onClick={handleJoin}>Join</button>
            <button onClick={handleLogin}>Submit</button>
            <button onClick={handleKakaoLogin}>Kakao</button>
            <button onClick={handleGoogleLogin}>Google</button>
        </div>
    )
}
export default LoginInputArea;