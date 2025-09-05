import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building2, Lock, Edit3 } from "lucide-react";

const EditInputArea = ({ loginUser }) => {
  const [state, setState] = useState({
    email: loginUser.email,
    pw: "",
    name: loginUser.name,
    nickname: loginUser.nickname,
    companyName: loginUser.companyName,
    userType: loginUser.userType,
    userRole: "COMPANY",
  });

  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setState({ ...state, [field]: event.target.value });
  };

  const handleEdit = (event) => {
    event.preventDefault();

    const editRequest = {
      email: state.email,
      password: state.pw,
      name: state.name,
      nickname: state.nickname,
      companyName: state.companyName,
      userType: state.userType,
      userRole: state.userRole,
    };

    fetch(process.env.REACT_APP_ABASE_URL+`/api/user/edit`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(editRequest),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        response.text();
      })
      .then(() => {
        alert("회원 내용 변경에 성공했습니다.");
        navigate("/mypage");
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[600px] h-[600px]">
        <h1
          className="text-2xl font-bold text-blue-700 mb-6 text-center"
          style={{ fontSize: "50px", marginBottom: "60px", marginTop: "30px" }}
        >
          회원 정보 수정
        </h1>

        <form className="space-y-5">
          {/* Password */}
          <div className="flex items-center gap-3">
            <Lock className="text-blue-500" size={30} />
            <input
              type="password"
              value={state.pw}
              onChange={handleChange("pw")}
              placeholder="비밀번호"
              className="flex-1 border rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{fontSize:"25px", margin:"10px"}}
            />
          </div>

          {/* Name */}
          <div className="flex items-center gap-3">
            <User className="text-blue-500" size={30} />
            <input
              type="text"
              value={state.name}
              onChange={handleChange("name")}
              placeholder="이름"
              className="flex-1 border rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{fontSize:"25px", margin:"10px"}}
            />
          </div>

          {/* Nickname */}
          <div className="flex items-center gap-3">
            <User className="text-blue-500" size={30} />
            <input
              type="text"
              value={state.nickname}
              onChange={handleChange("nickname")}
              placeholder="닉네임"
              className="flex-1 border rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{fontSize:"25px", margin:"10px"}}
            />
          </div>

          {/* Company Name */}
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-500" size={30} />
            <input
              type="text"
              value={state.companyName}
              onChange={handleChange("companyName")}
              placeholder="회사명"
              className="flex-1 border rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{fontSize:"25px", margin:"10px"}}
            />
          </div>

          {/* 버튼 */}
          <div className="text-center pt-6">
            <button
              type="submit"
              onClick={handleEdit}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              style={{ fontSize: "15px", margin: "10px" }}
            >
              <Edit3 size={20} />
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInputArea;
