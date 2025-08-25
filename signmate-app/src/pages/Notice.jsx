// src/pages/NoticePage.jsx
import React, { useState, useEffect } from "react";
import "../component/contracts/NoticePage.css";

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/notices",{
  headers: {
    "Authorization": "Bearer " + localStorage.getItem("accessToken")
  }}) // 백엔드 API
      .then((res) => {
        if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
        return res.json();
      })
      .then((data) => {
        setNotices(data); // DB에서 가져온 공지사항 배열 저장
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(keyword.toLowerCase()) ||
      n.content.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isLoading) return <p>로딩중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div className="notice-container">
      <div className="notice-banner">
        <img src="/images/notice.png" alt="공지사항 배너" />
      </div>
      <h2>공지사항</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="공지사항 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="admin-btn">
        <a href="/notice/create" className="btn btn-primary">
          공지사항 글쓰기
        </a>
      </div>

      <div className="notice-list">
        {filteredNotices.map((notice) => (
          <div key={notice.nbno} className="notice-item">
            <a href={`/notice/${notice.nbno}`} className="notice-title">
              {notice.title}
            </a>
            <div className="notice-date">{notice.regdate}</div>
            <div className="notice-content">{notice.content}</div>
          </div>
        ))}

        {filteredNotices.length === 0 && (
          <p style={{ textAlign: "center", color: "#888" }}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
