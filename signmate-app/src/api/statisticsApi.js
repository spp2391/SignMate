import axios from 'axios';

// const API_BASE_URL = 'http://springboot-developer-env.eba-jjxe7rgt.ap-northeast-2.elasticbeanstalk.com/api/statistics';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL+"/api/statistics";

export const getCompanyStatistics = async (companyName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${companyName}`);
    return response.data;
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
};
