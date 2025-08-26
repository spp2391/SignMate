// import { Link } from "react-router-dom";
// import "../../assets/css/style.css";
// import "../../assets/css/plugin.css";
// import "../../assets/css/setting.css";
// import "../../assets/css/templatehouse.css";
// import logo from "../../assets/images/logo_small.png";
// import logo2 from "../..//assets/icons/ico_s20_close_white.svg";
// import NotificationBell from "../../pages/NotificationBell";  


// const Header = () => {
//     return (
//         <header className="th-layout-header">
//             <div className="temhabank-N1" id="LKMdzPpn9D">
//                 <div className="header-container container-md">
//                     <div className="header-left">
//                         <h2 className="header-title">
//                             <Link to="/">
//                                 <img height="82" src={logo} alt="SIGN MATE" />
//                             </Link>
//                         </h2>
//                     </div>
//                     <div className="header-center">
//                         <div className="header-gnb">
//                             <ul className="header-gnblist">
//                                 <li className="header-gnbitem">
//                                     <Link className="header-gnblink" to="javascript:void(0)">
//                                         <span>서비스</span>
//                                     </Link>
//                                 </li>
//                                 <li className="header-gnbitem">
//                                     <Link className="header-gnblink" to="javascript:void(0)">
//                                         <span>이용안내</span>
//                                     </Link>
//                                 </li>
//                                 <li className="header-gnbitem">
//                                     <Link className="header-gnblink" to="/lawcomponent">
//                                         <span>법적효력</span>
//                                     </Link>
//                                 </li>
//                                 <li className="header-gnbitem">
//                                     <Link className="header-gnblink" to="javascript:void(0)">
//                                         <span>공지사항</span>
//                                     </Link>
//                                 </li>
//                                 {/* <li className="header-gnbitem">
//                 <Link className="header-gnblink" to="javascript:void(0)">
//                   <span>오픈뱅킹</span>
//                 </Link>
//               </li> */}
//                             </ul>
//                         </div>
//                     </div>
//                     <div className="header-right">
//                         <div className="header-utils">
//                             <ul>
//                                 <li className="auth-menu">
//                                     <NotificationBell />
//                                     </li>

//                                     <li className="allmenu">
//                                     <button className="btn-allmenu">
//                                         <i className="ico-hamburger"></i>
//                                         <i className="ico-hamburger"></i>
//                                         <i className="ico-hamburger"></i>
//                                     </button>
//                                     </li>
//                                 {/* 로그인 상태일 때 */}
//                                 {/* <li className="auth-menu">
//                                     <Link className="header-gnblink" to="/member/profile"><span>마이페이지</span></Link>
//                                 </li> */}
//                                 {/* style="padding-right: 30px;" */}
//                                 {/* <li className="auth-menu" >
//                                     <Link className="header-gnblink" to="@{/member/logout}"><span>로그아웃</span></Link>
//                                 </li> */}
//                                 {/* <li className="auth-menu">
//                                     <Link className="header-gnblink" to="@{/admin/panel}"><span>관리자 페이지</span></Link>
//                                 </li> */}
//                                 {/* 비로그인 상태일 때 */}
//                                 <li className="auth-menu">
//                                     <Link className="header-gnblink" to="@{/member/login}"><span>로그인</span></Link>
//                                 </li>
//                                  {/* style="padding-right: 30px;" */}
//                                 <li className="auth-menu">
//                                     <Link className="header-gnblink" to="@{/member/join}"><span>회원가입</span></Link>
//                                 </li>

//                                 <li className="allmenu">
//                                     <button className="btn-allmenu">
//                                         <i className="ico-hamburger"></i>
//                                         <i className="ico-hamburger"></i>
//                                         <i className="ico-hamburger"></i>
//                                     </button>
//                                 </li>
//                             </ul>
//                         </div>
//                         <button className="btn-momenu">
//                             <i className="ico-hamburger"></i>
//                             <i className="ico-hamburger"></i>
//                             <i className="ico-hamburger"></i>
//                         </button>
//                     </div>
//                     <button className="btn-momenu">
//                         <i className="ico-hamburger"></i>
//                         <i className="ico-hamburger"></i>
//                         <i className="ico-hamburger"></i>
//                     </button>
//                 </div>
//                 <div className="header-fullmenu fullmenu-top">
//                     <div className="fullmenu-wrapper">
//                         <div className="fullmenu-head">
//                             <h4 className="fullmenu-title">
//                                 <Link to="javascript:void(0)">
//                                      <img height="82" src={logo} alt="SIGN MATE" />
//                                 </Link>
//                             </h4>
//                         </div>
//                         <ul className="fullmenu-gnblist">
//                             <li className="fullmenu-gnbitem">
//                                 <Link className="h5 fullmenu-gnblink" to="javascript:void(0)">
//                                     <span>개인뱅킹</span>
//                                 </Link>
//                                 <ul className="fullmenu-sublist">
//                                     <li className="fullmenu-subitem">
//                                         <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
//                                             <span></span>
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </li>
//                             <li className="fullmenu-gnbitem">
//                                 <Link className="h5 fullmenu-gnblink" to="javascript:void(0)">
//                                     <span>기업뱅킹</span>
//                                 </Link>
//                                 <ul className="fullmenu-sublist">
//                                     <li className="fullmenu-subitem">
//                                         <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
//                                             <span></span>
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </li>
//                             <li className="fullmenu-gnbitem">
//                                 <Link className="h5 fullmenu-gnblink" to="javascript:void(0)">
//                                     <span>금융상품</span>
//                                 </Link>
//                                 <ul className="fullmenu-sublist">
//                                     <li className="fullmenu-subitem">
//                                         <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
//                                             <span></span>
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </li>
//                             <li className="fullmenu-gnbitem">
//                                 <Link className="h5 fullmenu-gnblink" to="javascript:void(0)">
//                                     <span>외환</span>
//                                 </Link>
//                                 <ul className="fullmenu-sublist">
//                                     <li className="fullmenu-subitem">
//                                         <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
//                                             <span></span>
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </li>
//                             <li className="fullmenu-gnbitem">
//                                 <Link className="h5 fullmenu-gnblink"  to="javascript:void(0)">
//                                     <span>오픈뱅킹</span>
//                                 </Link>
//                                 <ul className="fullmenu-sublist">
//                                     <li className="fullmenu-subitem">
//                                         <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
//                                             <span></span>
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </li>
//                         </ul>
//                     </div>
//                     <button className="fullmenu-close">
//                         <img src={logo2} alt="닫기" />
//                     </button>
//                 </div>
//             </div>
//         </header >
//     );
// }

// export default Header;