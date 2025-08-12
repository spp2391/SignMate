import { useState } from "react";

const InputArea = () => {
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
    const handleLogin = () => {
        const loginRequest = {
            email: state.id,
            password: state.password
        }
        fetch("/api/user/login", loginRequest)
        .then((response) => response.json())
        .then((data) => setState({
            status: data
        }))
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
            <button onClick={handleLogin}>Submit</button>
        </div>
    )
}
export default InputArea;