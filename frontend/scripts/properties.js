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
        <div class="flex items-center justify-between mt-4">
          <!-- Edit + Delete Icons -->
          <div class="flex gap-2">
            <button class="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg shadow transition duration-150" onclick="startEditProperty(${index})" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
              </svg>
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition duration-150" onclick="startDeleteProperty(${index})" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
              </svg>
            </button>
          </div>

          <!-- Eye Icon -->
          <button class="ml-auto text-blue-600 hover:text-blue-800 transition duration-150" onclick="viewPropertyDetails(${index})" title="View Details">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
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
