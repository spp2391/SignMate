import React, { useEffect, useState } from "react";

function MyPage2() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 호출로 로그인 사용자 정보 가져오기
    // 예시용 임시 데이터
    setTimeout(() => {
      setUserInfo({
        name: "영희",
        email: "younghee@example.com",
        role: "사용자",
        joinedDate: "2023-01-15",
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p>사용자 정보를 불러오는 중...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>마이페이지</h2>
      <p><strong>이름:</strong> {userInfo.name}</p>
      <p><strong>이메일:</strong> {userInfo.email}</p>
      <p><strong>역할:</strong> {userInfo.role}</p>
      <p><strong>가입일:</strong> {userInfo.joinedDate}</p>

      {/* 추가 기능들 예: 비밀번호 변경, 회원 정보 수정 등 넣을 수 있음 */}
    </div>
  );
}

export default MyPage2;
