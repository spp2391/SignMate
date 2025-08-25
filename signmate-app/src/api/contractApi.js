import axios from 'axios';

const API_BASE = 'http://localhost:8080/contracts'; // Spring Boot 서버 주소

export const getContractsByUser = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE}/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error('API 호출 실패', error);
    return [];
  }
};
