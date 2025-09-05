import React, { useState } from "react";
import axios from "axios";
import { FaRegFileAlt, FaRegEdit, FaUpload, FaBullhorn } from "react-icons/fa";

export default function UploadNotice() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    const token = localStorage.getItem("accessToken");

    try {
      await axios.post("/api/notices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("공지사항 등록 완료!");
      setTitle("");
      setContent("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("공지사항 등록 실패");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-8">
        {/* 제목 */}
        <div className="flex items-center gap-2 mb-6 justify-center" style={{fontSize:"30px"}}>
          <FaBullhorn className="text-blue-500 text-2xl" style={{fontSize:"30px"}}/>
          <h2 className="text-2xl font-bold text-gray-800" style={{fontSize:"30px", marginLeft:"5px"}}>공지사항 등록</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 제목 입력 */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <FaRegFileAlt className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 outline-none"
            />
          </div>

          {/* 내용 입력 */}
          <div className="flex items-start border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
            <FaRegEdit className="text-gray-400 mr-2 mt-2" />
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="flex-1 outline-none resize-none"
            />
          </div>

          {/* 파일 업로드 */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 cursor-pointer">
            <FaUpload className="text-gray-400 mr-2" />
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="flex-1 text-gray-600 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded-lg file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {/* 등록 버튼 */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition duration-200"
          >
            <FaBullhorn /> 등록
          </button>
        </form>
      </div>
    </div>
  );
}
