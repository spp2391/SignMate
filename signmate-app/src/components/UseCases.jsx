// import React, { useState } from "react";

// const UseCases = () => {
//   const [activeTab, setActiveTab] = useState("부서별");

//   const cases = [
//     {
//       icon: "👤",
//       title: "인사",
//       desc: "전체 임직원 일괄 서명 처리 및 개별 임직원 HR 문서 업무가 편리해집니다.",
//     },
//     {
//       icon: "📊",
//       title: "영업",
//       desc: "계약서 작성 속도와 고객 만족도를 향상시키세요.",
//     },
//     {
//       icon: "📢",
//       title: "마케팅",
//       desc: "많은 외부 파트너와 계약도 전자계약으로 쉽고 편리하게 관리하세요.",
//     },
//     {
//       icon: "💰",
//       title: "재무 · 회계",
//       desc: "재무 관리 정확도를 높이고 계약 업무 비용을 절감할 수 있습니다.",
//     },
//     {
//       icon: "💻",
//       title: "개발",
//       desc: "NDA, 라이선스 계약서를 안전하게 보관하고 보안을 강화하세요.",
//     },
//     {
//       icon: "⚖️",
//       title: "법무",
//       desc: "중요한 법적 검토를 신속하게 처리하고 내부 계약 정보를 연계해 확인하세요.",
//     },
//     {
//       icon: "📈",
//       title: "기획・전략",
//       desc: "계약 문서 공유로 소통 비용을 절감하여 프로젝트 진행 속도를 높여보세요.",
//     },
//     {
//       icon: "🛒",
//       title: "구매",
//       desc: "ERP 및 구매관리시스템과의 연동으로 중복 작업을 줄일 수 있습니다.",
//     },
//     {
//       icon: "🏢",
//       title: "경영지원",
//       desc: "페이퍼리스, 계약 업무 간소화로 스마트한 업무 환경을 구축하세요.",
//     },
//   ];

//   return (
//     <section className="bg-white py-24 text-center">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* 제목 */}
//         <h2
//           className="text-4xl font-extrabold text-gray-900 mb-10 leading-snug 
//                      transition-all duration-300 ease-in-out hover:text-yellow-500 hover:scale-105 inline-block"
//           style={{ fontSize: "50px" }}
//         >
//           모든 산업 및 부서에서 <br /> 이용하고 있습니다
//         </h2>

//         {/* 탭 */}
//         <div className="flex justify-center space-x-10 mb-16">
//           {["부서별"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               style={{ marginTop: "30px", fontSize: "30px" }}
//               className={`pb-3 border-b-4 text-2xl transition-all duration-300 ease-in-out ${
//                 activeTab === tab
//                   ? "border-yellow-500 text-yellow-500 font-bold"
//                   : "border-transparent text-gray-600 hover:text-gray-800 hover:scale-105"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* 카드 그리드 */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {cases.map((item, index) => (
//             <div
//               key={index}
//               className="bg-gray-50 rounded-2xl p-10 shadow-md 
//                          transition-all duration-300 ease-in-out 
//                          hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]"
//             >
//               <div className="text-4xl mb-6">{item.icon}</div>
//               <h3
//                 className="text-2xl font-semibold mb-4 text-gray-900 transition-all duration-300"
//                 style={{ fontSize: "25px" }}
//               >
//                 {item.title}
//               </h3>
//               <p
//                 className="text-lg text-gray-700 leading-relaxed transition-all duration-300"
//                 style={{ fontSize: "18px" }}
//               >
//                 {item.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UseCases;

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartBar, faBullhorn, faMoneyBill, faLaptopCode, faGavel, faChartLine, faCartShopping, faBuilding } from '@fortawesome/free-solid-svg-icons';

const UseCases = () => {
  const [activeTab, setActiveTab] = useState("부서별");

  const cases = [
    { icon: faUser, title: "인사", desc: "전체 임직원 일괄 서명 처리 및 개별 임직원 HR 문서 업무가 편리해집니다." },
    { icon: faChartBar, title: "영업", desc: "계약서 작성 속도와 고객 만족도를 향상시키세요." },
    { icon: faBullhorn, title: "마케팅", desc: "많은 외부 파트너와 계약도 전자계약으로 쉽고 편리하게 관리하세요." },
    { icon: faMoneyBill, title: "재무 · 회계", desc: "재무 관리 정확도를 높이고 계약 업무 비용을 절감할 수 있습니다." },
    { icon: faLaptopCode, title: "개발", desc: "NDA, 라이선스 계약서를 안전하게 보관하고 보안을 강화하세요." },
    { icon: faGavel, title: "법무", desc: "중요한 법적 검토를 신속하게 처리하고 내부 계약 정보를 연계해 확인하세요." },
    { icon: faChartLine, title: "기획・전략", desc: "계약 문서 공유로 소통 비용을 절감하여 프로젝트 진행 속도를 높여보세요." },
    { icon: faCartShopping, title: "구매", desc: "ERP 및 구매관리시스템과의 연동으로 중복 작업을 줄일 수 있습니다." },
    { icon: faBuilding, title: "경영지원", desc: "페이퍼리스, 계약 업무 간소화로 스마트한 업무 환경을 구축하세요." },
    // { icon: "👤", title: "인사", desc: "전체 임직원 일괄 서명 처리 및 개별 임직원 HR 문서 업무가 편리해집니다." },
    // { icon: "📊", title: "영업", desc: "계약서 작성 속도와 고객 만족도를 향상시키세요." },
    // { icon: "📢", title: "마케팅", desc: "많은 외부 파트너와 계약도 전자계약으로 쉽고 편리하게 관리하세요." },
    // { icon: "💰", title: "재무 · 회계", desc: "재무 관리 정확도를 높이고 계약 업무 비용을 절감할 수 있습니다." },
    // { icon: "💻", title: "개발", desc: "NDA, 라이선스 계약서를 안전하게 보관하고 보안을 강화하세요." },
    // { icon: "⚖️", title: "법무", desc: "중요한 법적 검토를 신속하게 처리하고 내부 계약 정보를 연계해 확인하세요." },
    // { icon: "📈", title: "기획・전략", desc: "계약 문서 공유로 소통 비용을 절감하여 프로젝트 진행 속도를 높여보세요." },
    // { icon: "🛒", title: "구매", desc: "ERP 및 구매관리시스템과의 연동으로 중복 작업을 줄일 수 있습니다." },
    // { icon: "🏢", title: "경영지원", desc: "페이퍼리스, 계약 업무 간소화로 스마트한 업무 환경을 구축하세요." },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-white py-24 text-center">
      <div className="max-w-6xl mx-auto px-6">
        {/* 제목 (스크롤 인/호버 효과) */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.03, color: "#F59E0B" }} // hover 시 색상 + 확대
          transition={{ duration: 0.28 }}
          className="text-4xl font-extrabold text-gray-900 mb-10 leading-snug inline-block"
          style={{ fontSize: "50px" }}
        >
          모든 산업 및 부서에서 <br /> 이용하고 있습니다
        </motion.h2>

        {/* 탭 (호버 스케일) */}
        <div className="flex justify-center space-x-10 mb-16">
          {["부서별"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.18 }}
              style={{ marginTop: "30px", fontSize: "30px" }}
              className={`pb-3 border-b-4 text-2xl ${
                activeTab === tab
                  ? "border-yellow-500 text-yellow-500 font-bold"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* 카드 그리드 (스크롤 인 + hover 동작) */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {cases.map((item, index) => (
            
            <motion.div
              key={index}
              className="bg-gray-50 rounded-2xl p-10 shadow-md"
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <FontAwesomeIcon icon={item.icon} className="text-4xl mb-6" />
              {/* <div className="text-4xl mb-6">{item.icon}</div>
              <img src={item.icon} alt={item.title} className="text-4xl mb-6" /> */}
              <h3
                className="text-2xl font-semibold mb-4 text-gray-900"
                style={{ fontSize: "25px" }}
              >
                {item.title}
              </h3>

              <p
                className="text-lg text-gray-700 leading-relaxed"
                style={{ fontSize: "18px" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UseCases;

