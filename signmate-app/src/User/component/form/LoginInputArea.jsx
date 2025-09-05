import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, MessageCircle, Globe, BadgeCheck } from "lucide-react";

const LoginInputArea = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
    }
  }, [location]);

  const [state, setState] = useState({
    id: "",
    pw: "",
  });

  const handleChangeId = (e) => setState({ ...state, id: e.target.value });
  const handleChangePw = (e) => setState({ ...state, pw: e.target.value });

  const handleLogin = (e) => {
    e.preventDefault();
    const loginRequest = { email: state.id, password: state.pw };

    fetch(process.env.REACT_APP_ABASE_URL+`/api/user/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginRequest),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.text();
      })
      .then((token) => {
        localStorage.setItem("accessToken", token);
        alert("로그인 되었습니다.");
        navigate("/");
      })
      .catch((e) => alert(e.message));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-[500px]">
        {/* 타이틀 */}
        <h1
          className="text-4xl font-bold text-blue-700 text-center mb-8"
          style={{ fontSize: "50px" , marginTop:"20px", marginBottom:"50px"}}
        >
          로그인
        </h1>

        {/* 입력창 */}
        <div className="space-y-5">
          <div className="flex items-center border rounded-lg px-4 py-4 focus-within:ring-2 focus-within:ring-blue-400" style={{marginBottom:"30px"}}>
            <Mail className="text-blue-500" size={28} />
            <input
              type="email"
              value={state.id}
              onChange={handleChangeId}
              placeholder="이메일"
              className="flex-1 ml-3 outline-none text-lg"
              style={{fontSize: "20px"}}
            />
          </div>

          <div className="flex items-center border rounded-lg px-4 py-4 focus-within:ring-2 focus-within:ring-blue-400" style={{marginBottom:"30px"}}>
            <Lock className="text-blue-500" size={28} />
            <input
              type="password"
              value={state.pw}
              onChange={handleChangePw}
              placeholder="비밀번호"
              className="flex-1 ml-3 outline-none text-lg"
              style={{fontSize: "20px"}}
            />
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white text-xl py-3 rounded-lg shadow hover:bg-blue-700 transition"
          style={{marginBottom:"20px", marginTop:"30px"}}
        >
          <LogIn size={28} />
          로그인
        </button>

        {/* 소셜 로그인 */}
        <div className="mt-8 space-y-4">
          <a
            href={`${process.env.REACT_APP_ABASE_URL}/oauth2/authorization/kakao`}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black text-lg py-3 rounded-lg shadow hover:bg-yellow-500 transition"
          >
            <MessageCircle size={28} />
            카카오 로그인
          </a>

          {/* <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white text-lg py-3 rounded-lg shadow hover:bg-red-600 transition">
            <Globe size={28} />
            구글 로그인
          </button>

          <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white text-lg py-3 rounded-lg shadow hover:bg-green-600 transition">
            <BadgeCheck size={28} />
            네이버 로그인
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default LoginInputArea;
