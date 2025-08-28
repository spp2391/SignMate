import { Link } from "react-router-dom";
import "../../assets/css/style.css";
import "../../assets/css/plugin.css";
import "../../assets/css/setting.css";
import "../../assets/css/templatehouse.css";
import logo1 from "../../assets/icons/ico_transaction.svg";
import logo2 from "../../assets/icons/ico_transfer.svg";
import logo3 from "../../assets/icons/ico_certcenter.svg";
import logo5 from "../../assets/icons/ico_transaction.svg";
import logo6 from "../../assets/icons/ico_transfer.svg";
import logo7 from "../../assets/icons/ico_certcenter.svg";
import logo8 from "../../assets/icons/ico_loan.svg";
import logo9 from "../../assets/icons/ico_transaction.svg";
import logo10 from "../../assets/icons/ico_transfer.svg";
import logo11 from "../../assets/icons/ico_certcenter.svg";
import logo14 from "../../assets/icons/ico_person.svg";
import logo15 from "../../assets/icons/ico_authcenter.svg";
import logo16 from "../../assets/icons/ico_security.svg";
import logo17 from "../../assets/icons/ico_message.svg";
import logo18 from "../../assets/icons/ico_person.svg";
import logo19 from "../../assets/icons/ico_faq.svg";
import logo20 from "../../assets/icons/ico_email.svg";
import logo21 from "../../assets/icons/ico_message.svg";
import logo22 from "../../assets/icons/ico_message.svg";
import logo23 from "../../assets/icons/ico_person.svg";
import React, { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import kakao from "../../assets/icons/kakao_icon.png"
import naver from "../../assets/icons/naver_icon.png"
import { motion } from "framer-motion";
import UseCases from "../../components/UseCases";
import { format } from "date-fns";
import { ko } from "date-fns/locale";


// 🔵 SignmateHeroBanner 컴포넌트 + AlertCard 내부 포함
function SignmateHeroBanner({ kakaoSrc, mailSrc, className = "" }) {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.6 },
    }),
  };

  const lines = [
    "이메일, 카카오톡으로",
    "직접 서명해 보세요",
    "상대방의 서명을 체험해 보세요!",
    "회원가입 없이 간편하게 서명할 수 있어요."
  ];

  return (
    <section
      className={"w-full bg-gradient-to-br from-sky-100 via-cyan-100 to-teal-100" + " " + className}
      aria-label="SIGNMATE 소개 배너"
    >
      <div className="mx-auto max-w-[2000px] px-6 sm:px-10 lg:px-16 2xl:px-24 py-14 sm:py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            {lines.map((line, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={textVariants}
                viewport={{ once: true }}
                className="block font-bold"
                style={{
                  paddingLeft: index < 2 ? "300px" : "350px",
                  paddingTop: index < 2 ?  "20px" : "0px",
                  paddingBottom: index < 2 ?  "20px" : "0px",
                  margin: "10px 0",
                  fontSize: index < 2 ? "65px" : "30px"
                }}
              >
                {line}
              </motion.div>
            ))}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6 items-start">
            <AlertCard
              imgSrc={kakaoSrc}
              imgAlt="KakaoTalk"
              title="SIGNMATE"
              message="근로계약서 서명 요청합니다."
              badgeText="알림"
            />
            <AlertCard
              imgSrc={mailSrc}
              imgAlt="메일"
              title="SIGNMATE"
              message="동의서에 서명할 차례입니다."
              badgeText="알림"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
// function SignmateHeroBanner({ kakaoSrc, mailSrc, className = "" }) {
//   return (
//     <section
//       className={
//         "w-full bg-gradient-to-br from-sky-100 via-cyan-100 to-teal-100" +
//         " " + className
//       }
//       aria-label="SIGNMATE 소개 배너"
//     >
//       <div className="mx-auto max-w-[2000px] px-6 sm:px-10 lg:px-16 2xl:px-24 py-14 sm:py-20 lg:py-28">
//         <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-2">
//           {/* Left */}
//           <div>
//             <h1 className="font-bold leading-tight text-slate-900 tracking-tight text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl">
//               <span className="block" style={{paddingLeft : "300px", margin : "10px", fontSize : "65px"}}>이메일, 카카오톡으로</span>
//               <span className="block" style={{paddingLeft : "300px", margin : "10px", marginBottom: "40px", fontSize : "60px"}}>직접 서명해 보세요</span>
//             </h1>
//             <span className="mt-8 text-slate-800 text-lg sm:text-xl lg:text-2xl" style={{paddingLeft : "350px", fontSize : "30px"}}>
//               상대방의 서명을 체험해 보세요! </span>
//               <span className="hidden sm:block" style={{paddingLeft : "350px", fontSize : "30px"}}>
//               회원가입 없이 간편하게 서명할 수 있어요. </span>
            
//           </div>
//           {/* Right */}
//           <div className="flex flex-col gap-6 items-start">
//             <AlertCard
//               imgSrc={kakaoSrc}
//               imgAlt="KakaoTalk"
//               title="SIGNMATE"
//               message="근로계약서 서명 요청합니다."
//               badgeText="알림"
//             />
//             <AlertCard
//               imgSrc={mailSrc}
//               imgAlt="메일"
//               title="SIGNMATE"
//               message="동의서에 서명할 차례입니다."
//               badgeText="알림"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// AlertCard 내부 컴포넌트
function AlertCard({ imgSrc, imgAlt, title, message, badgeText }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-white/95 shadow-lg ring-1 ring-black/5 max-w-lg"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex items-center gap-4 p-5 sm:p-6">
        <div className="shrink-0">
          <img
            src={imgSrc}
            alt={imgAlt}
            className="h-14 w-14 rounded-2xl object-contain"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-extrabold tracking-tight text-slate-900 text-xl sm:text-2xl" style={{fontSize: "20px"}}>
              {title}
            </p>
            {badgeText ? (
              <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                {badgeText}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-slate-700 text-sm sm:text-base" style={{fontSize: "20px"}}>
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ------------------- Index -------------------
const Index = () => {
  const [contract, setContract] = useState([]);
  const [setDashboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);

  const bgImages = [
    require("../../assets/images/temhabank_N3_01.png"),
    require("../../assets/images/background3.png"),
    require("../../assets/images/background1.png"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/contracts/user/3")
      .then((res) => res.json())
      .then((json) => {
        setContract(json.contracts);
        setDashboard(json.dashboard);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });

    fetch("/api/notices", {
      headers: { Authorization: "Bearer " + localStorage.getItem("accessToken") },
    })
      .then((res) => res.json())
      .then((json) => setNotices(json))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="th-layout-main">
      <div className="th-layout-content">
        {/* 기존 배너 */}
        <div
          className="temhabank-N3"
          style={{
            backgroundImage: `url(${bgImages[bgIndex]})`,
            transition: "background-image 1s ease-in-out",
          }}
          id="LhmdzpPNf2"
        >
          <div className="contents-container container-md">
            <div className="contents-inner">
              <div className="textset">
                <h2 className="h1 textset-tit">
                  언제 어디서나, 당신을 위한 스마트 웹사이트
                </h2>
                <p className="h4 textset-subtit">
                  모든 업무를 한 곳에서 이동없이 편안하게
                </p>
              </div>
            </div>
          </div>
        </div>
                <div className="temhabank-N4" id="SKMDzPpnpV">
                    <div className="contents-container container-md">
                        <div className="contents-inner">
                            <div className="tabset tabset-brick">
                                <ul className="tabset-list tabset-lg tabset-fill">
                                    {/* <li className="tabset-item">
                                        <Link className="tabset-link active" to="javascript:void(0)">
                                            <i className="ff-ico ti-bell"></i>
                                            <span>서비스</span>
                                        </Link>
                                    </li>
                                    <li className="tabset-item">
                                        <Link className="tabset-link" to="javascript:void(0)">
                                            <i className="ff-ico ti-grid2"></i>
                                            <span>자주찾는 메뉴</span>
                                        </Link>
                                    </li>
                                    <li className="tabset-item">
                                        <Link className="tabset-link" to="javascript:void(0)">
                                            <i className="ff-ico ti-chat-square-text"></i>
                                            <span>고객센터</span>
                                        </Link>
                                    </li> */}
                                </ul>
                            </div>
                            <div className="cont-area">
                                <div className="tab-cont">
                                    <div className="col-left active">
                                        <div className="menu-item primary">
                                            <Link to="/contracts">
                                                <img src={logo1} alt="거래내역" />
                                                <span className="h6">문서작성</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item primary-alpha">
                                            <Link to="/inbox">
                                                <img src={logo2} alt="조회/이체" />
                                                <span className="h6">내 문서 조회</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item secondary-alpha">
                                            <Link to="javascript:void(0)">
                                                <img src={logo3} alt="법적효력" />
                                                <span className="h6">법적효력</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item secondary">
                                            <Link to="javascript:void(0)">
                                                <img src={logo14} alt="마이페이지" />
                                                <span className="h6">마이페이지</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-left">
                                        <div className="menu-item primary">
                                            <Link to="/contracts">
                                                <img src={logo5} alt="거래내역" />
                                                <span className="h6">문서작성</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item primary-alpha">
                                            <Link to="/inbox">
                                                <img src={logo6} alt="조회/이체" />
                                                <span className="h6">내 문서 조회</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item secondary-alpha">
                                            <Link to="javascript:void(0)">
                                                <img src={logo7} alt="법적효력" />
                                                <span className="h6">법적효력</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item secondary">
                                            <Link to="javascript:void(0)">
                                                <img src={logo8} alt="대출" />
                                                <span className="h6">매출 현황</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-left">
                                        <div className="menu-item primary">
                                            <Link to="javascript:void(0)">
                                                <img src={logo9} alt="거래내역" />
                                                <span className="h6">문서작성</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item primary-alpha">
                                            <Link to="javascript:void(0)">
                                                <img src={logo10} alt="조회/이체" />
                                                <span className="h6">내 문서 조회</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item secondary-alpha">
                                            <Link to="javascript:void(0)">
                                                <img src={logo11} alt="법적효력" />
                                                <span className="h6">법적효력</span>
                                            </Link>
                                        </div>
                                        <div className="menu-item secondary">
                                            <Link to="javascript:void(0)">
                                                <img src={logo14} alt="마이페이지" />
                                                <span className="h6">마이페이지</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-center active">
                                        <div className="notice">
                                            <div className="title">
                                                <strong className="h6">공지사항</strong>
                                                <Link to="/notice" className="ff-ico ti-plus">
                                                    <span className="blind">더보기</span>
                                                </Link>
                                                </div>
                                                <div className="notice-list">
                                                  {notices.slice(0, 10).map((notice) => (
                                                    <Link key={notice.nbno} to={`/notice/${notice.nbno}`}>
                                                      <p>{notice.title}</p>
                                                        <span>
                                                          {notice.regdate
                                                            ? format(new Date(notice.regdate), "yyyy.MM.dd HH:mm", { locale: ko })
                                                            : ""}
                                                        </span>
                                                    </Link>
                                              ))}
                                            </div>
                                            </div>
                                        {/* <div className="menu-wrap">
                                            <div className="menu-item gray-alpha">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo13} alt="알림함" />
                                                    <span className="h6">알림함</span>
                                                </Link>
                                            </div>
                                            <div className="menu-item gray">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo14} alt="마이페이지" />
                                                    <span className="h6">마이페이지</span>
                                                </Link>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="col-center">
                                        <div className="menu-wrap">
                                            <div className="menu-item gray">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo15} alt="공지사항" />
                                                    <span className="h6">공지사항</span>
                                                </Link>
                                            </div>
                                            <div className="menu-item gray-alpha">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo16} alt="고객센터" />
                                                    <span className="h6">고객센터</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="menu-wrap">
                                            <div className="menu-item gray-alpha">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo17} alt="알림함" />
                                                    <span className="h6">알림함</span>
                                                </Link>
                                            </div>
                                            <div className="menu-item gray">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo18} alt="마이페이지" />
                                                    <span className="h6">마이페이지</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-center">
                                        <div className="menu-wrap columns-3">
                                            <div className="menu-item">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo19} alt="FAQ" />
                                                    <span className="h6">FAQ</span>
                                                </Link>
                                            </div>
                                            <div className="menu-item">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo20} alt="이메일 상담" />
                                                    <span className="h6">이메일 상담</span>
                                                </Link>
                                            </div>
                                            
                                            <div className="menu-item">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo21} alt="채팅 상담" />
                                                    <span className="h6">채팅 상담</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="menu-wrap">
                                            <div className="menu-item gray-alpha">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo22} alt="알림함" />
                                                    <span className="h6">알림함</span>
                                                </Link>
                                            </div>
                                            <div className="menu-item gray">
                                                <Link to="javascript:void(0)">
                                                    <img src={logo23} alt="마이페이지" />
                                                    <span className="h6">마이페이지</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-right">
                                        <div className="title">
                                            <strong className="h6">계약서 현황</strong>
                                            <div className="btn-wrap">
                                                <button type="button" className="btn-prev ff-ico ti-chevron-rect-left">
                                                    <span className="blind">이전</span>
                                                </button>
                                                <button type="button" className="btn-play ff-ico ti-play-fill">
                                                    <span className="blind">재생</span>
                                                </button>
                                                <button type="button" className="btn-pause ff-ico ti-pause-fill active">
                                                    <span className="blind">정지</span>
                                                </button>
                                                <button type="button" className="btn-next ff-ico ti-chevron-rect-right">
                                                    <span className="blind">다음</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="swiper">
                                            <div className="swiper-wrapper">
                                                <Dashboard docs={contract} isLoading={isLoading} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 퀵 메뉴 */}
        {/* <div className="temhabank-N6" id="izmDzppO1O">
          <div className="contents-container">
            <button
              type="button"
              className="btn-open ff-ico ti-chevrons-rect-right"
            >
              <span className="blind">퀵 메뉴 열기</span>
            </button>
            <ul className="menu-list">
              <li className="item black">
                <button
                  type="button"
                  className="btn-close ff-ico ti-chevrons-rect-left"
                >
                  <span>닫기</span>
                </button>
              </li>
              <li className="item primary">
                <Link to="javascript:void(0)">
                  <img src={logo2} alt="내 문서 조회" />
                  <span>내 문서 조회</span>
                </Link>
              </li>
              <li className="item gray">
                <Link to="javascript:void(0)">
                  <img src={logo7} alt="법적효력" />
                  <span>법적효력</span>
                </Link>
              </li>
              <li className="item secondary">
                <Link to="javascript:void(0)">
                  <img src={logo19} alt="이용안내" />
                  <span>이용안내</span>
                </Link>
              </li>
              <li className="item primary-alpha">
                <Link to="javascript:void(0)">
                  <strong>고객센터</strong>
                  <span>070-2222-2222</span>
                </Link>
              </li>
            </ul>
          </div>
        </div> */}

        {/* 🔵 SIGNMATE 배너 */}
        <SignmateHeroBanner
          kakaoSrc={kakao}
          mailSrc={naver}
        />
        <UseCases />
      </div>
    </main>
  );
};

export default Index;