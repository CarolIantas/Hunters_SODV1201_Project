
function renderProperties() {
  const properties = JSON.parse(localStorage.getItem('properties')) || [];
  const container = document.getElementById('propertyList');
  container.innerHTML = '';
  properties.forEach((prop, index) => {
    const div = document.createElement('div');
    div.className = 'p-4 border rounded mb-2';
    div.innerHTML = `
      <p><strong>Address:</strong> ${prop.address}</p>
      <p><strong>Neighborhood:</strong> ${prop.neighborhood}</p>
      <button class="px-2 py-1 bg-blue-500 text-white rounded" onclick="startEditProperty(${index})">Edit</button>
      <button class="px-2 py-1 bg-red-500 text-white rounded" onclick="startDeleteProperty(${index})">Delete</button>
    `;
    container.appendChild(div);
  });
}

function startEditProperty(index) {
  const properties = JSON.parse(localStorage.getItem('properties')) || [];
  const prop = properties[index];
  document.getElementById('editPropertyId').value = index;
  document.getElementById('editPropertyAddress').value = prop.address;
  document.getElementById('editPropertyNeighborhood').value = prop.neighborhood;
  openModal('editPropertyModal');
}

function savePropertyEdit() {
  const index = document.getElementById('editPropertyId').value;
  const properties = JSON.parse(localStorage.getItem('properties')) || [];
  properties[index].address = document.getElementById('editPropertyAddress').value;
  properties[index].neighborhood = document.getElementById('editPropertyNeighborhood').value;
  localStorage.setItem('properties', JSON.stringify(properties));
  closeModal('editPropertyModal');
  renderProperties();
}

function startDeleteProperty(index) {
  document.getElementById('deletePropertyId').value = index;
  openModal('deletePropertyModal');
}

function confirmPropertyDelete() {
  const index = document.getElementById('deletePropertyId').value;
  const properties = JSON.parse(localStorage.getItem('properties')) || [];
  properties.splice(index, 1);
  localStorage.setItem('properties', JSON.stringify(properties));
  closeModal('deletePropertyModal');
  renderProperties();
}

document.addEventListener('DOMContentLoaded', renderProperties);
