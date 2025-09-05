 export const getLoginUserName = () => {
  try {
    const token = localStorage.getItem("accessToken"); // LoginInputArea에서 넣은 값 그대로
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
     console.log("JWT Payload 확인:", payload);
   return payload.username || payload.name || payload.sub;

  } catch (e) {
    console.error("JWT 파싱 실패", e);
    return null;
  }
};
