// src/services/apiService.js
const API_BASE_URL = 'http://localhost:3001';

async function request(url, method = 'GET', data) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// USERS
export const getUsers = () => request('/users');
export const getUserById = (id) => request(`/users/${id}`);
export const createUser = (user) => request('/users', 'POST', user);
export const login = (user) => request('/users', 'POST', user);
export const updateUser = (id, user) => request(`/users/${id}`, 'PUT', user);
export const deleteUser = (id) => request(`/users/${id}`, 'DELETE');

// PROPERTIES
export const getProperties = () => request('/properties');
export const getPropertyById = (id) => request(`/properties/${id}`);
export const createProperty = (property) => request('/properties', 'POST', property);
export const updateProperty = (id, property) => request(`/properties/${id}`, 'PUT', property);
export const deleteProperty = (id) => request(`/properties/${id}`, 'DELETE');

// WORKSPACES
export const getWorkspaces = () => request('/workspaces');
export const getWorkspaceById = (id) => request(`/workspaces/${id}`);
export const createWorkspace = (workspace) => request('/workspaces', 'POST', workspace);
export const updateWorkspace = (id, workspace) => request(`/workspaces/${id}`, 'PUT', workspace);
export const deleteWorkspace = (id) => request(`/workspaces/${id}`, 'DELETE');
