import { useEffect, useState } from "react";

export function useContracts(userId = 1) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8080/contracts/user/${data.userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const items = Array.isArray(json) ? json : (json?.contracts ?? []);
        setData(items);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { data, isLoading };
}
