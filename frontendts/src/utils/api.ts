import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const api = {
  login: async (email: string, password: string) => {
    const { data } = await axios.post(
      `${BASE_URL}/api/v1/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    return data.data;
  },
  signup: async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    await axios.post(
      `${BASE_URL}/api/v1/auth/signup`,
      { name, email, password, passwordConfirm },
      { withCredentials: true }
    );
  },
  logout: async () => {
    await axios.post(
      `${BASE_URL}/api/v1/auth/logout`,
      {},
      { withCredentials: true }
    );
  },
  getMe: async () => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/users/me`, {
      withCredentials: true,
    });
    return data.data;
  },
  getTodos: async (params = {}) => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/todos/`, {
      params,
      withCredentials: true,
    });
    console.log(data);
    return data;
  },
  getTodo: async (id: string) => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/todos/${id}`, {
      withCredentials: true,
    });
    return data.data;
  },
  createTodo: async (todo: { title: string; description: string }) => {
    const { data } = await axios.post(`${BASE_URL}/api/v1/todos/`, todo, {
      withCredentials: true,
    });
    return data.data;
  },
  updateTodo: async (
    id: string,
    update: { title?: string; description?: string }
  ) => {
    const { data } = await axios.patch(
      `${BASE_URL}/api/v1/todos/${id}`,
      update,
      {
        withCredentials: true,
      }
    );
    return data.data;
  },
  deleteTodo: async (id: string) => {
    await axios.delete(`${BASE_URL}/api/v1/todos/${id}`, {
      withCredentials: true,
    });
  },
  pinTodo: async (id: string) => {
    const { data } = await axios.patch(
      `${BASE_URL}/api/v1/todos/${id}/pin`,
      {},
      { withCredentials: true }
    );
    return data.data;
  },
  importantTodo: async (id: string) => {
    const { data } = await axios.patch(
      `${BASE_URL}/api/v1/todos/${id}/important`,
      {},
      { withCredentials: true }
    );
    return data.data;
  },
  completeTodo: async (id: string) => {
    const { data } = await axios.patch(
      `${BASE_URL}/api/v1/todos/${id}`,
      {},
      { withCredentials: true }
    );
    return data.data;
  },
  searchTodos: async (query: string) => {
    const { data } = await axios.get(
      `${BASE_URL}/api/v1/todos/search/${query}`,
      { withCredentials: true }
    );
    return data.data;
  },
  getUsers: async () => {
    const { data } = await axios.get(`${BASE_URL}/api/v1/users/`, {
      withCredentials: true,
    });
    return data.data;
  },
  createUser: async (user: {
    name: string;
    email: string;
    password: string;
  }) => {
    await axios.post(`${BASE_URL}/api/v1/users/`, user, {
      withCredentials: true,
    });
  },
  deleteUser: async (id: string) => {
    await axios.delete(`${BASE_URL}/api/v1/users/${id}`, {
      withCredentials: true,
    });
  },
};
