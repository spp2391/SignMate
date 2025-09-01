import axios from 'axios';

// const API_BASE = 'http://springboot-developer-env.eba-jjxe7rgt.ap-northeast-2.elasticbeanstalk.com/contracts'; // Spring Boot 서버 주소
const API_BASE = process.env.REACT_APP_API_BASE_URL+"/contracts";

export const getContractsByUser = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE}/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error('API 호출 실패', error);
    return [];
  }
};
