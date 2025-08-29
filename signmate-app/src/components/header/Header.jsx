import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/style.css";
import "../../assets/css/plugin.css";
import "../../assets/css/setting.css";
import "../../assets/css/templatehouse.css";
import logo from "../../assets/images/logo.png";
import logo2 from "../..//assets/icons/ico_s20_close_white.svg";
import NotificationBell from "../../pages/NotificationBell";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons"; 
import { faHandshake } from "@fortawesome/free-solid-svg-icons";


const Header = ({isLoggedIn, loginUser}) => {
    const [requireLoggedIn, setRequireLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setRequireLoggedIn(false);
        if (requireLoggedIn && !isLoggedIn) {
            alert("로그인.");
            navigate("/login");
        }
    },[])
    return (
        <header className="th-layout-header">
            <div className="temhabank-N1" id="LKMdzPpn9D">
                <div className="header-container container-md">
                    <div className="header-left">
                        <h2 className="header-title">
                            <Link to="/">
                                <img height="1" src={logo} alt="SIGN MATE" />
                            </Link>
                        </h2>
                    </div>
                    <div className="header-center">
                        <div className="header-gnb">
                            <ul className="header-gnblist">
                                <li className="header-gnbitem">
                                    <Link className="header-gnblink" to="/contracts">
                                        <span>서비스</span>
                                    </Link>
                                </li>
                                <li className="header-gnbitem">
                                    <Link className="header-gnblink" to="/guide">
                                        <span>이용안내</span>
                                    </Link>
                                </li>
                                <li className="header-gnbitem">
                                    <Link className="header-gnblink" to="/lawcomponent">
                                        <span>법적효력</span>
                                    </Link>
                                </li>
                                <li className="header-gnbitem">
                                    <Link className="header-gnblink" to="/notice">
                                        <span>공지사항</span>
                                    </Link>
                                </li>
                                {/* <li className="header-gnbitem">
                <Link className="header-gnblink" to="javascript:void(0)">
                  <span>오픈뱅킹</span>
                </Link>
              </li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="header-utils">
                            <ul>
                                    {/* <li className="allmenu">
                                    <button className="btn-allmenu">
                                        <i className="ico-hamburger"></i>
                                        <i className="ico-hamburger"></i>
                                        <i className="ico-hamburger"></i>
                                    </button>
                                    </li> */}
                                {/* 로그인 상태일 때 */}
                                {isLoggedIn ? 
                                    <li className="auth-menu" >
                                        <Link className="header-gnblink" to="/">
                                            <span>
                                            {/* <FontAwesomeIcon icon={faHandshake} style={{ marginRight: "8px", color: "#ebd725ff" }} /> */}
                                            <FontAwesomeIcon icon={faFaceSmile} style={{ marginRight: "8px", color: "#259cebff" }} size={40} />
                                            {loginUser.name} 님 환영합니다.
                                            
                                            </span>
                                        </Link>
                                    </li> : ""
                                }
                                {isLoggedIn ?
                                    <li className="auth-menu">
                                        <Link className="header-gnblink" to="/mypage"><span>마이페이지</span></Link>
                                    </li> : ""
                                }
                                {isLoggedIn ? 
                                    <li className="auth-menu" >
                                        <Link className="header-gnblink" onClick={() => {
                                                                                            localStorage.removeItem("accessToken");
                                                                                            cookieStore.delete("refresh_token");
                                                                                            // fetch("http://localhost:8080/api/user/logout");
                                                                                            alert("로그아웃 되었습니다.");
                                                                                        }}><span>로그아웃</span></Link>
                                    </li> : ""
                                }
                                {/* {loginUser.userType==="ADMIN" ?
                                    <li className="auth-menu">
                                        <Link className="header-gnblink" to="/admin/panel"><span>관리자 페이지</span></Link>
                                    </li> : ""
                                } */}
                                {isLoggedIn ? "" : 
                                    <li className="auth-menu">
                                        <Link className="header-gnblink" to="/login"><span>로그인</span></Link>
                                    </li>
                                }
                                {isLoggedIn ? "" : 
                                    <li className="auth-menu">
                                        <Link className="header-gnblink" to="/join"><span>회원가입</span></Link>
                                    </li>
                                }
                                <li className="auth-menu">
                                    <NotificationBell />
                                </li>
                                {/* <li className="allmenu">
                                    <button className="btn-allmenu">
                                        <i className="ico-hamburger"></i>
                                        <i className="ico-hamburger"></i>
                                        <i className="ico-hamburger"></i>
                                    </button>
                                </li> */}
                            </ul>
                        </div>
                        <button className="btn-momenu">
                            <i className="ico-hamburger"></i>
                            <i className="ico-hamburger"></i>
                            <i className="ico-hamburger"></i>
                        </button>
                    </div>
                    <button className="btn-momenu">
                        <i className="ico-hamburger"></i>
                        <i className="ico-hamburger"></i>
                        <i className="ico-hamburger"></i>
                    </button>
                </div>
                <div className="header-fullmenu fullmenu-top">
                    <div className="fullmenu-wrapper">
                        <div className="fullmenu-head">
                            <h4 className="fullmenu-title">
                                <Link to="/">
                                     <img height="82" src={logo} alt="SIGN MATE" />
                                </Link>
                            </h4>
                        </div>
                        <ul className="fullmenu-gnblist">
                            <li className="fullmenu-gnbitem">
                                <Link className="h5 fullmenu-gnblink" to="/contracts">
                                    <span>서비스</span>
                                </Link>
                                <ul className="fullmenu-sublist">
                                    <li className="fullmenu-subitem">
                                        <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
                                            <span></span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="fullmenu-gnbitem">
                                <Link className="h5 fullmenu-gnblink" to="/guide">
                                    <span>이용안내</span>
                                </Link>
                                <ul className="fullmenu-sublist">
                                    <li className="fullmenu-subitem">
                                        <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
                                            <span></span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="fullmenu-gnbitem">
                                <Link className="h5 fullmenu-gnblink" to="/lawcomponent">
                                    <span>법적효력</span>
                                </Link>
                                <ul className="fullmenu-sublist">
                                    <li className="fullmenu-subitem">
                                        <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
                                            <span></span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="fullmenu-gnbitem">
                                <Link className="h5 fullmenu-gnblink" to="/notice">
                                    <span>공지사항</span>
                                </Link>
                                <ul className="fullmenu-sublist">
                                    <li className="fullmenu-subitem">
                                        <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
                                            <span></span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="fullmenu-gnbitem">
                                <Link className="h5 fullmenu-gnblink"  to="/inbox">
                                    <span>내 문서 조회</span>
                                </Link>
                                <ul className="fullmenu-sublist">
                                    <li className="fullmenu-subitem">
                                        <Link className="p1 fullmenu-sublink" to="javascript:void(0)">
                                            <span></span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <button className="fullmenu-close">
                        <img src={logo2} alt="닫기" />
                    </button>
                </div>
            </div>
        </header >
    );
}

export default Header;