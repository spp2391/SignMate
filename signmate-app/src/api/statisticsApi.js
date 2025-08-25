import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/statistics';

export const getCompanyStatistics = async (companyName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${companyName}`);
    return response.data;
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
};
