import "./login.css";
import { useState } from "react";

const JoinInputArea = () => {
    const [state, setState] = useState(
        {
            status: "Status"
        }
    )
    const handleChangeEmail = (event) => {
        setState({
            ...state,
            email: event.target.value,
        })
    }
    const handleChangePw = (event) => {
        setState({
            ...state,
            pw: event.target.value,
        })
    }
    const handleChangeName = (event) => {
        setState({
            ...state,
            name: event.target.value,
        })
    }
    const handleChangeNickname = (event) => {
        setState({
            ...state,
            nickname: event.target.value,
        })
    }
    const handleChangeCompanyName = (event) => {
        setState({
            ...state,
            companyName: event.target.value,
        })
    }
    const handleChangeUserType = (event) => {
        setState({
            ...state,
            userType: event.target.value,
        })
    }
    const handleChangeUserRole = (event) => {
        setState({
            ...state,
            userRole: event.target.value,
        })
    }
    const handleJoin = (event) => {
        event.preventDefault();
        const joinRequest = {
            email: state.email,
            password: state.pw,
            name: state.name,
            nickname: state.nickname,
            companyName: "ABC",
            userType: state.userType,
            userRole: state.userRole,
        }
        fetch("http://localhost:8080/api/user/join", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(joinRequest),
        })
        .then((response) =>
            response.text()
        )
        // .then(text=>{
            
        // })
    }

    return (
        <div className="login-container">
        <div className="login-card">
            <div className="logo">
                <h1>Join</h1>
            </div>
            <div className="input-group">
                <input
                        type="email"
                        value={state.email}
                        onChange={handleChangeEmail}
                        placeholder="email"
                />
                <input
                    type="pw"
                    value={state.pw}
                    onChange={handleChangePw}
                    placeholder="password"
                />
                <input
                    type="text"
                    value={state.name}
                    onChange={handleChangeName}
                    placeholder="name"
                />
                <input
                    type="text"
                    value={state.nickname}
                    onChange={handleChangeNickname}
                    placeholder="nickname"
                />
                <input
                    type="text"
                    value={state.companyName}
                    onChange={handleChangeCompanyName}
                    placeholder="company name"
                />
                <div>
                    <input
                        type="text"
                        value={state.userType}
                        onChange={handleChangeUserType}
                        placeholder="usertype PRIVATE/COMPANY"
                    />
                </div>
                <input
                    type="text"
                    value={state.userRole}
                    onChange={handleChangeUserRole}
                    placeholder="userRole USER/ADMIN"
                />
                {/* <div>
                    {state.status}
                </div> */}
            </div>
            <div className="options">
                <label><input type="checkbox" id="terms" required /> [필수] 약관 전체 동의</label>
            </div>         
            <div>
                <button onClick={handleJoin}>Join</button>
            </div>
            <div className="helper-links">
                <a href="/">이미 계정이 있으신가요? 로그인</a>
            </div>
        </div>
        </div>
    )
}

export default JoinInputArea;