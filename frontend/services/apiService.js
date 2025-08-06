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
const api_getUsers = () => request('/users');
const api_getUserById = (id) => request(`/users/${id}`);
const api_createUser = (user) => request('/users', 'POST', user);
const api_login = (user) => request('/users', 'POST', user);
const api_updateUser = (id, user) => request(`/users/${id}`, 'PUT', user);
const api_deleteUser = (id) => request(`/users/${id}`, 'DELETE');

// PROPERTIES
const api_getProperties = () => request('/properties');
const api_getPropertyById = (id) => request(`/properties/${id}`);
const api_createProperty = (property) => request('/properties', 'POST', property);
const api_updateProperty = (id, property) => request(`/properties/${id}`, 'PUT', property);
const api_deleteProperty = (id) => request(`/properties/${id}`, 'DELETE');

// WORKSPACES
const api_getWorkspaces = () => request('/workspaces');
const api_getWorkspaceById = (id) => request(`/workspaces/${id}`);
const api_createWorkspace = (workspace) => request('/workspaces', 'POST', workspace);
const api_updateWorkspace = (id, workspace) => request(`/workspaces/${id}`, 'PUT', workspace);
const api_deleteWorkspace = (id) => request(`/workspaces/${id}`, 'DELETE');
