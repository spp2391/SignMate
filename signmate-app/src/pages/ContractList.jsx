// ContractListWithFeatures.jsx
import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const contracts = [
  { title: "비밀유지서약서", desc: ["기업/기관용 비밀유지 서약서", "중요 정보와 기밀 사항을 안전하게 보호합니다."], path: "/secret", color: "#f8d7da" },
  { title: "표준근로계약서", desc: ["근로계약서 작성용", "근로자와 사용자의 조건을 명확히 하고 분쟁을 예방합니다."], path: "/employment", color: "#cfe2ff" },
  { title: "용역계약서", desc: ["서비스/용역 계약용", "업무 범위, 제공 서비스, 대가 등을 명확히 규정합니다."], path: "/service", color: "#d1e7dd" },
  { title: "자재/물품 공급계약서", desc: ["물품/자재 공급 계약", "물품 규격, 수량, 납기, 결제 조건 등을 명확히 합니다."], path: "/supply", color: "#fff3cd" },
  { title: "업무위탁 계약서", desc: ["업무 위탁 계약용", "외주 업무 범위와 책임을 명확히 하고 안전한 진행을 보장합니다."], path: "/outsourcing", color: "#e2e3e5" },
  // { title: "직접 작성", desc: ["계약서를 직접 작성해보세요", "템플릿에 없는 맞춤 계약서를 자유롭게 작성할 수 있습니다."], path: "/custom", color: "#c9b6d3" },
];

const featuresData = [
  { title: "계약서 작성", details: ["다양한 파일 지원 (HWP, DOCX, PDF, XLSX, JPG, PNG 등)", "문서 편집", "템플릿 활용", "법률 서식 제공", "다양한 작성란"] },
  { title: "계약 체결", details: ["사인・도장 이미지 제작", "이메일・카카오톡 전송", "대량전송", "링크서명", "대면서명", "맞춤 브랜딩 등"] },
  { title: "계약 관리", details: ["문서 자동 교부", "문서 데이터 추출 및 검색", "라벨 설정", "계약 리마인더, 대시보드, 공용 워크스페이스"] },
  { title: "인증 및 보안", details: ["감사추적인증서 발급", "다양한 인증 수단", "완료문서 잠금, 문서 위변조 확인", "IP 접근 제어, 2단계 인증"] },
  { title: "API 연동", details: ["전자계약 API 연동", "세일즈포스 패키지 Add-on 기능", "재피어 연동", "SSO, 전용망 통신"] },
];

const AccordionItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 px-6 text-left font-semibold text-xl hover:text-yellow-500 transition-colors rounded-md"
        style={{fontSize:"25px"}}
      >
        {item.title}
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} size="lg" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pl-8 pb-6 text-gray-700 list-disc space-y-2 text-lg"
          >
            {item.details.map((detail, idx) => (
              <li key={idx} style={{fontSize:"18px", margin:"20px"}}>{detail}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContractListWithFeatures = ({ isLoggedIn, loginUser }) => {
   const navigate = useNavigate();
  const [memberType, setMemberType] = useState();

  useEffect(() => {
      if (!isLoggedIn) {
        alert("로그인이 필요한 서비스입니다..");
        navigate("/login", { replace: true });
      } else {
        if (loginUser.kakaoId) {
          setMemberType("kakao");
        } else if (loginUser.googleId) {
          setMemberType("google");
        } else if (loginUser.naverId) {
          setMemberType("naver");
        } else {
          setMemberType("normal");
        }
      }
    }, []);
     const typeLabel =
    memberType === "kakao"
      ? "카카오 회원"
      : memberType === "google"
      ? "구글 회원"
      : memberType === "naver"
      ? "네이버 회원"
      : "일반 회원";
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      {/* 슬로건 */}
      <p style={{ textAlign: "center", color: "#3d3d3dff", fontSize: "5.5rem", marginBottom: 100, marginTop: 100 }}>
        시작부터 끝까지, <span style={{ fontWeight: "bold", color: "rgba(0, 134, 243, 1)" }}>사인메이트</span>로
      </p>

      {/* 계약서 목록 */}
      <h1 style={{ marginBottom: 30, fontSize: "2rem", fontWeight: 700, color: "#222", textAlign: "center" }}>계약서 목록</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {contracts.map((c, idx) => (
          <Link
            to={c.path}
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              borderRadius: 20,
              padding: "32px 24px",
              minHeight: 220,
              backgroundColor: c.color,
              boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: "#333" }}>{c.title}</div>
            <div style={{ lineHeight: 1.8 }}>
              {c.desc.map((line, idx) => (
                <div key={idx} style={{ fontSize: idx === 0 ? 16 : 15, fontWeight: idx === 0 ? 600 : 400, color: idx === 0 ? "#333" : "#555", marginBottom: idx === 0 ? 6 : 0 }}>
                  {line}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* 기능 아코디언 */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center" style={{fontSize:"40px", lineHeight:"60px", marginTop:"50px", marginBottom:"50px"}}>
          계약에 필요한 기능, 모두싸인은 갖추고 있습니다
        </h2>
        <div className="bg-white shadow-lg rounded-xl divide-y divide-gray-200">
          {featuresData.map((item, idx) => (
            <AccordionItem key={idx} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContractListWithFeatures;
