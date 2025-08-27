import React, { useState } from "react";
import axios from "axios";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <button type="submit">등록</button>
    </form>
  );
}
