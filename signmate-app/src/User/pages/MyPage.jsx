import { Link, useNavigate } from "react-router-dom";
import "../component/form/login.css";
import { useEffect, useState } from "react";

const MyPage = ({isLoggedIn, loginUser}) => {
    const navigate = useNavigate();
    const [memberType, setMemberType] = useState();
    useEffect(() => {
        console.log(isLoggedIn)
        console.log(loginUser);
        if (!isLoggedIn) {
            alert("로그인 해주세요.");
            navigate("/login");            
        } else {
            if(loginUser.kakaoId) {
                setMemberType("kakao");
            } else if(loginUser.googleId) {
                setMemberType("google");
            } else if(loginUser.naverId) {
                setMemberType("naver");
            } else {
                setMemberType("normal");
            }
        }
    }, [])
    return (
        <div className="login-container">
            {!isLoggedIn ? "" :
                <div className="login-card">
                    <div className="logo">
                        <h1>회원 정보</h1>
                        <div className="input-group">
                            {memberType==="kakao" ?
                                <div>카카오 회원입니다.</div>
                                : memberType==="google" ?
                                    <div>구글 회원입니다. 이메일: {loginUser.email}</div>
                                    : memberType==="naver" ?
                                        <div>네이버 회원입니다. 이메일: {loginUser.email}</div>
                                        : <div>일반 회원입니다. 이메일: {loginUser.email}</div>
                            }
                            <div>이름: {loginUser.name}</div>
                            {
                                loginUser.nickname ?
                                    <div>닉네임: {loginUser.nickname}</div>
                                : ""
                            }
                            {
                                loginUser.companyName ?
                                    <div>회사명: {loginUser.companyName}</div>
                                : ""
                            }
                            <div>
                                <Link className="login-btn" to={"/mypage/edit"}>회원 정보 수정</Link>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default MyPage;