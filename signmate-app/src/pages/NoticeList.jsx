// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function NoticeList() {
//   const [notices, setNotices] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken"); // 로그인 시 저장한 토큰

//     axios.get("/api/notices", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => setNotices(res.data))
//       .catch(err => {
//         console.error(err);
//         alert("공지사항 불러오기 실패");
//       });
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//       {notices.map(notice => (
//         <NoticeCard key={notice.nbno} notice={notice} />
//       ))}
//     </div>
//   );
// }

// function NoticeCard({ notice }) {
//   const [currentImg, setCurrentImg] = useState(0);
//   const images = notice.imageUrls && notice.imageUrls.length > 0
//     ? notice.imageUrls
//     : ["/default-thumbnail.jpg"];

//   const nextImage = () => setCurrentImg((prev) => (prev + 1) % images.length);
//   const prevImage = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

//   return (
//     <div className="border rounded-lg shadow overflow-hidden">
//       <div className="relative h-64">
//         <img
//           src={images[currentImg]}
//           alt={notice.title}
//           className="w-full h-full object-cover"
//         />
//         {images.length > 1 && (
//           <>
//             <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded">◀</button>
//             <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-2 py-1 rounded">▶</button>
//           </>
//         )}
//       </div>
//       <div className="p-4">
//         <h2 className="font-bold text-lg">{notice.title}</h2>
//         <p className="text-gray-700 line-clamp-3">{notice.content}</p>
//       </div>
//     </div>
//   );
// }
