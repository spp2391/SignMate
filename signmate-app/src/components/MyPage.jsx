import React, { useEffect, useState } from "react";

function MyPage() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 실제 API 연결 시 fetch("/api/user/me") 사용
    setUserInfo({
      name: "김철수",
      email: "chulsoo@example.com",
      company: "철수컴퍼니",
    });
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>마이페이지</h2>
      {userInfo ? (
        <div>
          <p><strong>이름:</strong> {userInfo.name}</p>
          <p><strong>이메일:</strong> {userInfo.email}</p>
          <p><strong>회사명:</strong> {userInfo.company}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
}

export default MyPage;
