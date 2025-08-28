import { useEffect } from "react";
import EditInputArea from "../component/form/EditInputArea.jsx";
import { useNavigate } from "react-router-dom";

const Edit = ({isLoggedIn, loginUser}) => {
    const navigate = useNavigate();
    useEffect(() => {
        console.log(isLoggedIn)
        console.log(loginUser);
        if (!isLoggedIn) {
            alert("로그인 해주세요.");
            navigate("/login");            
        }
    }, [])
    return (
        <div>
            {!isLoggedIn ? "" :
                <EditInputArea loginUser={loginUser}/>
            }
        </div>
    )

}

export default Edit