import axios from "axios";

const api = axios.create({ baseURL: "/api/admin", withCredentials: false });

// 토큰 자동 첨부 (로컬스토리지 accessToken 사용)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 에러 처리 인터셉터 (필요 없으면 제거해도 무방)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response || err.message);
    return Promise.reject(err);
  }
);

//Users
export async function fetchUsers({ page = 0, size = 10, query = "" } = {}) {
  const params = { page, size };
  if (query) params.keyword = query; //  백엔드와 파라미터명 일치
  const { data } = await api.get("/users", { params });
  return data; // Page<UserListDto>
}

export async function getUserDetail(id) {
  const { data } = await api.get(`/users/${id}`);
  return data; // UserDetailDto
}

export async function updateUser(id, payload) {
  const { data } = await api.patch(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}

// Contracts
export async function fetchContracts({ page = 0, size = 10, query = "", status, type } = {}) {
  const params = { page, size };
  if (query) params.keyword = query;
  if (type && type !== "all") params.type = type;
  if (status && status !== "all") params.status = status; 

  const { data } = await api.get("/contracts", { params });
  return data; // Page<ContractListDto>
}

export async function getContractDetail(id) {
  const { data } = await api.get(`/contracts/${id}`);
  return data; // ContractDetailDto
}

export async function updateContract(id, payload) {
  const { data } = await api.patch(`/contracts/${id}`, payload);
  return data;
}

export async function deleteContract(id) {
  await api.delete(`/contracts/${id}`);
}
