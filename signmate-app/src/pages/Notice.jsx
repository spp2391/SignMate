// src/pages/NoticePage.jsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function NoticePage({ isLoggedIn, loginUser }) {
  const [notices, setNotices] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [expandedIds, setExpandedIds] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_ABASE_URL+`/api/notices`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("데이터를 불러오는 데 실패했습니다.");
        return res.json();
      })
      .then((data) => {
        setNotices(data);
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

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (isLoading)
    return <p className="text-center py-20 text-gray-500 text-lg">로딩중...</p>;
  if (error)
    return (
      <p className="text-center py-20 text-red-500 text-lg">
        에러: {error}
      </p>
    );

  return (
    <div className="max-w-[140rem] mx-auto px-6 py-16" style={{ marginBottom: "300px" }}>
      <h1 className="text-center font-bold mb-12 text-[40px]">공지사항</h1>

      {/* 검색 + 글쓰기 */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <input
          type="text"
          placeholder="공지사항 검색..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[20px]"
        />
        {isLoggedIn && loginUser?.userType === "ADMIN" && (
        <a
          href="/uploadnotice"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-[20px]"
        >
          공지사항 글쓰기
        </a>
      )}
      </div>

      {/* 공지 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.nbno}
              notice={notice}
              isExpanded={expandedIds.includes(notice.nbno)}
              toggleExpand={toggleExpand}
              openModal={setModalImage}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 py-10 col-span-full">
            검색 결과가 없습니다.
          </p>
        )}
      </div>

      {/* 이미지 모달 */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="확대 이미지"
            className="max-w-[90%] max-h-[90%] shadow-lg rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

// -----------------------------
// 개별 카드 컴포넌트
function NoticeCard({ notice, isExpanded, toggleExpand, openModal }) {
  const [currentImg, setCurrentImg] = useState(0);
  const images = notice.imageUrls?.length > 0 ? notice.imageUrls : ["/default-thumbnail.jpg"];

  const nextImage = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  // 날짜 포맷 적용
  const formattedDate = notice.regdate
    ? format(new Date(notice.regdate), "yyyy.MM.dd HH:mm", { locale: ko })
    : "";

  return (
    <div className="bg-white border rounded-lg shadow hover:shadow-xl overflow-hidden transition cursor-pointer">
      {/* 이미지 슬라이더 */}
      <div className="relative w-full h-64 md:h-72 lg:h-80 overflow-hidden group">
        <img
          src={images[currentImg]}
          alt={notice.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isExpanded ? "scale-105" : "scale-100"
          }`}
          onClick={() => openModal(images[currentImg])}
        />

        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded hover:bg-black/50"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              ◀
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded hover:bg-black/50"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              ▶
            </button>
          </>
        )}
      </div>

      {/* 내용 */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2 text-[14px]">
          <span className="text-orange-500 font-semibold">
            {notice.category || "공지사항"}
          </span>
          <span className="text-gray-400">— {formattedDate}</span>
        </div>

        <h2
          className="font-bold text-[22px] mb-2"
          onClick={() => toggleExpand(notice.nbno)}
        >
          {notice.title}
        </h2>

        <p
          className={`text-gray-700 text-[18px] transition-all duration-300 ${
            isExpanded ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          {notice.content}
        </p>

        {!isExpanded && notice.content.length > 100 && (
          <button
            className="mt-2 text-blue-500 font-semibold"
            onClick={() => toggleExpand(notice.nbno)}
          >
            더보기
          </button>
        )}
      </div>
    </div>
  );
}
