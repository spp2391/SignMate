import { useEffect } from "react";
import { useCheckLoggedIn } from "../../hooks/CheckLoggedIn";
import "./login.css";
import { useNavigate } from "react-router-dom";

const EditInputArea = () => {
    const {isLoggedIn, loginUser} = useCheckLoggedIn();
    const navigate = useNavigate
    useEffect({
        if (isLoggedIn) {
            alert("로그인 해주세요.");
            navigate("/login");
        }
    },[])
    
    
    // return (
    //     <div className="login-container">
    //     <div className="login-card">
    //         <div className="logo">
    //             <h1>Join</h1>
    //         </div>
    //         <div className="input-group">
    //             {/* <input
    //                     type="email"
    //                     value={state.email}
    //                     onChange={handleChangeEmail}
    //                     placeholder="email"
    //             /> */}
    //             <input
    //                 type="pw"
    //                 value={state.pw}
    //                 onChange={handleChangePw}
    //                 placeholder="password"
    //             />
    //             <input
    //                 type="text"
    //                 value={state.name}
    //                 onChange={handleChangeName}
    //                 placeholder="name"
    //             />
    //             <input
    //                 type="text"
    //                 value={state.nickname}
    //                 onChange={handleChangeNickname}
    //                 placeholder="nickname"
    //             />
    //             <input
    //                 type="text"
    //                 value={state.companyName}
    //                 onChange={handleChangeCompanyName}
    //                 placeholder="company name"
    //             />
    //             {/* <div>
    //                 userType USER/ADMIN
    //                 <input
    //                     type="text"
    //                     value={state.userType}
    //                     onChange={handleChangeUserType}
    //                 />
    //             </div> */}
    //             <input
    //                 type="text"
    //                 value={state.userRole}
    //                 onChange={handleChangeUserRole}
    //                 placeholder="userRole PRIVATE/COMPANY"
    //             />
    //             {/* <div>
    //                 {state.status}
    //             </div> */}
    //         </div>
    //         <div className="options">
    //             <label><input type="checkbox" id="terms" required /> [필수] 약관 전체 동의</label>
    //         </div>         
    //         <div>
    //             <button onClick={handleJoin}>Join</button>
    //         </div>
    //         {/* <div className="helper-links">
    //             <a href="/">이미 계정이 있으신가요? 로그인</a>
    //         </div> */}
    //     </div>
    //     </div>
    // )
}

export default EditInputArea;