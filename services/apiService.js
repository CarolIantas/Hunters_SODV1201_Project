// src/services/apiService.js
//const API_BASE_URL = 'http://localhost:3001';
const API_BASE_URL = 'https://hunters-sodv1201-project.onrender.com';

//file settings
const cloudName = "dl6a1uj4h";
const unsignedPreset = "SODV1201_Hunters";

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

//file handle
async function api_saveImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", unsignedPreset);
  res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });  
  const data = await res.json();
  return data;
}

// Function to geocode and place markers
  async function api_geocodeAddress(address) {
      try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

          const response = await fetch(url, {
              headers: {
                  'Accept-Language': 'en',
                  'User-Agent': 'WorkSpaceWebApp (p.kuchakmolina@mybvc.ca)'
              }
          });

          return await response.json();
          
      } catch (error) {
          console.error(`Error geocoding '${address}':`, error);
          return null;
      }
  }

// USERS
const api_getUsers = () => request('/users');
const api_getUserById = (id) => request(`/users/${id}`);
const api_createUser = (user) => request('/users', 'POST', user);
const api_login = (user) => request('/users/login', 'POST', user);
const api_updateUser = (id, user) => request(`/users/${id}`, 'PUT', user);
const api_deleteUser = (id) => request(`/users/${id}`, 'DELETE');

// PROPERTIES
const api_getProperties = () => request('/properties');
const api_getPropertyById = (id) => request(`/properties/${id}`);
const api_getPropertiesByUser = (user) => request('/properties/user', 'POST', user);
const api_createProperty = (property) => request('/properties', 'POST', property);
const api_updateProperty = (id, property) => request(`/properties/${id}`, 'PUT', property);
const api_deleteProperty = (id) => request(`/properties/${id}`, 'DELETE');

// WORKSPACES
const api_getWorkspaces = () => request('/workspaces');
const api_getWorkspaceById = (id) => request(`/workspaces/${id}`);
const api_getWorkspaceByPropertyId = (id) => request(`/workspaces/property/${id}`);
const api_createWorkspace = (workspace) => request('/workspaces', 'POST', workspace);
const api_updateWorkspace = (id, workspace) => request(`/workspaces/${id}`, 'PUT', workspace);
const api_deleteWorkspace = (id) => request(`/workspaces/${id}`, 'DELETE');
