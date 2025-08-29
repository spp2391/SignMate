import { useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";

const JoinInputArea = () => {
    const [state, setState] = useState({
        email: "",
        pw: "",
        name: "",
        nickname: "",
        companyName: "",
        userType: "USER",
        userRole: "COMPANY",
    })
    const navigate = useNavigate();
    // const [isCompanyNameDisabled, setIsCompanyNameDisabled] = useState(true);
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
    // const handleChangeUserType = (event) => {
    //     setState({
    //         ...state,
    //         userType: event.target.value,
    //     })
    // }
    // const handleChangeUserRole = (event) => {
    //     setState({
    //         ...state,
    //         userRole: event.target.value,
    //     })
    //     console.log(event.target.value);
    //     if (state.userRole === "COMPANY") {
    //         setIsCompanyNameDisabled(true);        
    //     } else {
    //         setIsCompanyNameDisabled(false);        
    //     }
    // }
    const handleJoin = (event) => {
        event.preventDefault();
        const joinRequest = {
            email: state.email,
            password: state.pw,
            name: state.name,
            nickname: state.nickname,
            companyName: state.companyName,
            userType: state.userType,
            userRole: state.userRole,
        }
        // if (state.userRole === "PRIVATE") {
        //     joinRequest.companyName = "";
        // }
        fetch("http://localhost:8080/api/user/join", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(joinRequest),
        })
        .then(async (response) => {
            if (!response.ok) {
                throw new Error(await response.text());
            }
            response.text()
        })
        .then(()=>{
            alert("회원가입에 성공했습니다.");
            navigate("/login")
        })
        .catch((e) => {
            alert(e.message);
            // console.log(e.message);
        })
    }

    return (
        <div className="login-container">
        <div className="login-card">
            <div className="logo">
                <h1>Join</h1>
            </div>
            <div className="input-group">
                {/* Email */}
                <input
                        type="email"
                        value={state.email}
                        onChange={handleChangeEmail}
                        placeholder="email"
                />
                {/* Password */}
                <input
                    type="password"
                    value={state.pw}
                    onChange={handleChangePw}
                    placeholder="password"
                />
                {/* Name */}
                <input
                    type="text"
                    value={state.name}
                    onChange={handleChangeName}
                    placeholder="name"
                />
                {/* Nickname */}
                <input
                    type="text"
                    value={state.nickname}
                    onChange={handleChangeNickname}
                    placeholder="nickname"
                />
                {/* Company Name (if Exists) */}
                <input
                    type="text"
                    value={state.companyName}
                    onChange={handleChangeCompanyName}
                    placeholder="company name"
                    // disabled={isCompanyNameDisabled}
                />
                {/* <div>
                    userType USER/ADMIN
                    <input
                        type="text"
                        value={state.userType}
                        onChange={handleChangeUserType}
                    />
                </div> */}
                {/* <input
                    type="text"
                    value={state.userRole}
                    onChange={handleChangeUserRole}
                    placeholder="userRole PRIVATE/COMPANY"
                /> */}
                {/* <fieldset>
                    <input
                        type="radio"
                        value="PRIVATE"
                        name="userRole"
                        checked={state.userRole==="PRIVATE"}
                        onChange={handleChangeUserRole}
                        defaultChecked
                    /> 개인회원     
                    <input 
                        type="radio"
                        value="COMPANY"
                        name="userRole"
                        checked={state.userRole==="COMPANY"}
                        onChange={handleChangeUserRole}
                    /> 기업회원
                </fieldset> */}
            </div>
            <div className="options">
                <label><input type="checkbox" id="terms" required /> [필수] 약관 전체 동의</label>
            </div>         
            <div>
                <button className="login-btn" onClick={handleJoin}>Join</button>
            </div>
            <div className="helper-links">
                <a href="/">이미 계정이 있으신가요? 로그인</a>
            </div>
        </div>
        </div>
    )
}

export default JoinInputArea;