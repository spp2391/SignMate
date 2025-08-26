import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export function useContracts() {
  const [contracts, setContracts] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  console.log("✅ useContracts 실행됨, userId =", userId);

  setIsLoading(true);
  fetch(`http://localhost:8080/contracts/user/${userId}`)
    .then((res) => {
      console.log("📩 fetch 응답", res);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((json) => {
      console.log("📦 응답 데이터", json);
      const items = Array.isArray(json) ? json : (json?.contracts ?? []);
      setData(items);
    })
    .catch((err) => {
      console.error("❌ fetch 에러:", err);
      setData([]);
    })
    .finally(() => setIsLoading(false));
}, [userId]);

  return { contracts, dashboard, isLoading };
}
