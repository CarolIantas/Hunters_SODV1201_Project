function renderProperties() {
  const properties = JSON.parse(localStorage.getItem('properties')) || [];
  const container = document.getElementById('propertyList');
  container.innerHTML = '';

  properties.forEach((prop, index) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';

    card.innerHTML = `
      <div class="bg-gray-200 h-40 flex items-center justify-center">
        <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-2">${prop.address || 'No Address'}</h3>
        <p class="text-sm text-gray-600 mb-4">${prop.neighborhood || 'No Neighborhood'}</p>
        <div class="flex gap-2">
          <button class="bg-gray-800 text-white px-3 py-1 text-sm rounded" onclick="startEditProperty(${index})">Edit</button>
          <button class="bg-red-600 text-white px-3 py-1 text-sm rounded" onclick="startDeleteProperty(${index})">Delete</button>
          <button class="text-blue-600 text-sm underline" onclick="viewPropertyDetails(${index})">Read more</button>
        </div>
      </div>
    `;

    container.appendChild(card);
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

document?.addEventListener('DOMContentLoaded', renderProperties);

document?.getElementById("addPropertyForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const address = document.getElementById("newPropertyAddress").value.trim();
  const neighborhood = document.getElementById("newPropertyNeighborhood").value.trim();

  if (!address || !neighborhood) return alert("Both fields are required.");

  const properties = JSON.parse(localStorage.getItem("properties")) || [];
  properties.push({ address, neighborhood });
  localStorage.setItem("properties", JSON.stringify(properties));

  document?.getElementById("addPropertyForm").reset();

  document?.getElementById("addNewPropertyButton").classList.remove("hidden")

  const propertyList = document?.getElementById("propertyList");    
  propertyList.classList.remove("hidden");

  this.classList.add("hidden")

  renderProperties();
});

document?.getElementById("addNewPropertyButton").addEventListener("click", function (e) {
  const propertyForm = document?.getElementById("addPropertyForm");
  const propertyList = document?.getElementById("propertyList");  
  propertyForm.classList.remove("hidden");
  propertyList.classList.add("hidden");
  this.classList.add("hidden")
});

document?.getElementById("cancelButton").addEventListener("click", function (e) {
  const propertyForm = document?.getElementById("addPropertyForm");
  const propertyList = document?.getElementById("propertyList");  
  const addNewPropertyButton = document?.getElementById("addNewPropertyButton");
  propertyForm.classList.add("hidden");
  propertyList.classList.remove("hidden");
  addNewPropertyButton.classList.remove("hidden");  
});
