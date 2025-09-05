import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Mail, Building2, UserCheck, Edit3 } from "lucide-react";

const MyPage = ({ isLoggedIn, loginUser }) => {
  const navigate = useNavigate();
  const [memberType, setMemberType] = useState();

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다..");
      navigate("/login");
    } else {
      if (loginUser.kakaoId) {
        setMemberType("kakao");
      } else if (loginUser.googleId) {
        setMemberType("google");
      } else if (loginUser.naverId) {
        setMemberType("naver");
      } else {
        setMemberType("normal");
      }
    }
  }, [isLoggedIn, loginUser, navigate]);

  const typeLabel =
    memberType === "kakao"
      ? "카카오 회원"
      : memberType === "google"
      ? "구글 회원"
      : memberType === "naver"
      ? "네이버 회원"
      : "일반 회원";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {isLoggedIn && (
        <div className="bg-white shadow-lg rounded-2xl p-10 w-[600px] h-[600px]">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center" style={{fontSize:"50px", marginBottom:"40px", marginTop:"20px"}}>
            마이페이지
          </h1>

          {/* 회원 유형 */}
          <div className="flex items-center gap-3 border-b pb-3 mb-4" >
            <UserCheck className="text-blue-500" size={30}/>
            <span className="font-medium" style={{fontSize:"25px", margin:"20px"}}>{typeLabel}</span>
          </div>

          {/* 회원 정보 */}
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-3">
              <User className="text-blue-500" size={30} />
              <span style={{fontSize:"25px", margin:"20px"}}>이름: {loginUser.name}</span>
            </div>

            {loginUser.email && (
              <div className="flex items-center gap-3">
                <Mail className="text-blue-500" size={30}/>
                <span style={{fontSize:"25px", margin:"20px"}}>이메일: {loginUser.email}</span>
              </div>
            )}

            {loginUser.nickname && (
              <div className="flex items-center gap-3">
                <User className="text-blue-500"size={30}/>
                <span style={{fontSize:"25px", margin:"20px"}}>닉네임: {loginUser.nickname}</span>
              </div>
            )}

            {loginUser.companyName && (
              <div className="flex items-center gap-3">
                <Building2 className="text-blue-500" size={30}/>
                <span style={{fontSize:"25px", margin:"20px"}}>회사명: {loginUser.companyName}</span>
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="mt-6 text-center">
            <Link
              to="/mypage/edit"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              style={{fontSize:"20px", margin:"20px"}}
            >
              <Edit3 size={40} />
              회원 정보 수정
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
