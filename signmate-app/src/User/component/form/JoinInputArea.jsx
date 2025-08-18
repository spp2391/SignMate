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
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(joinRequest),
        })
        .then((data) => setState({
            status: data
        }))
    }

    return (
        <div>
            <h1>Join</h1>
            <div>
                email
                <input
                    type="email"
                    value={state.email}
                    onChange={handleChangeEmail}
                />
            </div>
            <div>
                password
                <input
                    type="pw"
                    value={state.pw}
                    onChange={handleChangePw}
                />
            </div>
            <div>
                name
                <input
                    type="text"
                    value={state.name}
                    onChange={handleChangeName}
                />
            </div>
            <div>
                nickname
                <input
                    type="text"
                    value={state.nickname}
                    onChange={handleChangeNickname}
                />
            </div>
            <div>
                companyName
                <input
                    type="text"
                    value={state.companyName}
                    onChange={handleChangeCompanyName}
                />
            </div>
            <div>
                userType USER/ADMIN
                <input
                    type="text"
                    value={state.userType}
                    onChange={handleChangeUserType}
                />
            </div>
            <div>
                userRole PRIVATE/COMPANY
                <input
                    type="text"
                    value={state.userRole}
                    onChange={handleChangeUserRole}
                />
            </div>
            <div>
                {state.status}
            </div>
            <div>
                <button onClick={handleJoin}>Join</button>
            </div>
        </div>
    )
}

export default JoinInputArea;