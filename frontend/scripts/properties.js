
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
        <h3 class="font-semibold text-gray-800 mb-2">${prop?.title || 'No Address'}</h3>
        <p class="text-sm text-gray-600 mb-4">${prop?.address} - ${prop?.neighborhood || 'No Neighborhood'}</p>
        <div class="flex items-center justify-between mt-4">
          <!-- Edit + Delete Icons -->
          <div class="flex gap-2">
            <button class="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg shadow transition duration-150" onclick="startEditProperty(${prop?.id})" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
              </svg>
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition duration-150" onclick="startDeleteProperty(${prop?.id})" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
              </svg>
            </button>
          </div>

          <!-- Eye Icon -->
          <button class="ml-auto text-blue-600 hover:text-blue-800 transition duration-150" onclick="viewPropertyDetails(${prop?.id})" title="View Details">
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


async function startEditProperty(index) {
  //get the data from the property to update  
  //try to get from cache
  const properties = JSON.parse(localStorage.getItem("properties"));
  const indexProp = properties.findIndex(f => f.id === index);
  let property;
  if (indexProp > -1) {
    property = properties[indexProp];
  } else {
    //get from database
    //GET property by id
    const res = await fetch(`http://localhost:3001/properties/${index}`);

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized
        throw new Error(`Get property failed with status: ${res.status}`, res);
    }

    property = await res.json();        
    
  }

  //form fields
  const newPropertyName = document?.getElementById("newPropertyName");
  const newPropertyAddress = document?.getElementById("newPropertyAddress");
  const newPropertyNeighborhood = document?.getElementById("newPropertyNeighborhood");
  const propertyImage = document?.getElementById("propertyImage");
  const newSqft = document?.getElementById("newSqft");
  const parking = document?.getElementById("parking");
  const publicTransportation = document?.getElementById("publicTransportation");
  const listingStatus = document?.getElementById("listingStatus");

  newPropertyName.value = property.title;
  newPropertyAddress.value = property.address;
  newPropertyNeighborhood.value = property.neighborhood;
  //propertyImage.value = property.images;
  newSqft.value = property.SQ_foot;
  parking.value = property.parking;
  publicTransportation.value = property.Public_transport;
  listingStatus.value = 1;

  document?.getElementById("addPropertyForm").setAttribute("property_id", property.id);

  showForm();
}

function startDeleteProperty(index) {
  document.getElementById('deletePropertyId').value = index;
  openModal('deletePropertyModal');
}

async function confirmPropertyDelete() {

  const index = document.getElementById('deletePropertyId').value;  
    
  //delete from database
  const resDel = await deleteProperty(index);

  if (!resDel.ok) {
    //get item in the local storage and delete it
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    properties.splice(index-1, 1);

    localStorage.setItem('properties', JSON.stringify(properties));
    closeModal('deletePropertyModal');
    renderProperties();
  }  
}

document?.addEventListener('DOMContentLoaded', renderProperties);

document?.getElementById("addPropertyForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  //form fields
  const newPropertyName = document?.getElementById("newPropertyName");
  const newPropertyAddress = document?.getElementById("newPropertyAddress");
  const newPropertyNeighborhood = document?.getElementById("newPropertyNeighborhood");
  const propertyImage = document?.getElementById("propertyImage");
  const newSqft = document?.getElementById("newSqft");
  const parking = document?.getElementById("parking");
  const publicTransportation = document?.getElementById("publicTransportation");
  const listingStatus = document?.getElementById("listingStatus");

  console.log(propertyImage.files[0]);

  //Set the object:
  const propertyObj = {    
    "user_id": JSON.parse(localStorage.getItem("currentUser")).user_id,
    "title": newPropertyName.value,
    "Public_transport": publicTransportation.value === "on",
    "image": propertyImage.files[0],
    "smoking": true,
    "SQ_foot": newSqft.value,
    "address": newPropertyAddress.value,
    "neighborhood": newPropertyNeighborhood.value,
    "images": "Generic.jpg",
    "type_of_properties": "house",
    "parking": parking.value === "on",
    "status": listingStatus.value,
    "date": new Date(),    
  };

  //check if it is an update or an insert
  const property_id = this.getAttribute("property_id");  
  let newOrUpdateProperty;
  if (property_id === null) {
    //insert in the database
    const maxPropertyId = JSON.parse(localStorage.getItem("properties")).length + 1;
    propertyObj.id = maxPropertyId;
    newOrUpdateProperty = await createProperty(propertyObj);    
  } else {
    //update in the database
    propertyObj.id = property_id;
    newOrUpdateProperty = await updateProperty(propertyObj); 
  };

  //update local storage
  const propertyLS = JSON.parse(localStorage.getItem("properties"));
  const indexPropLS = propertyLS?.findIndex(f => f.id == propertyObj.id);
  if (indexPropLS > -1) {
    propertyLS[indexPropLS] = newOrUpdateProperty;
  } else {
    propertyLS.push(newOrUpdateProperty);    
  };

  localStorage.setItem('properties', JSON.stringify(propertyLS));
    
  //remove id attribute
  this.removeAttribute("property_id");

  //reset screen
  document?.getElementById("addPropertyForm").reset();
  document?.getElementById("addNewPropertyButton").classList.remove("hidden")
  const propertyList = document?.getElementById("propertyList");
  propertyList.classList.remove("hidden");
  this.classList.add("hidden")

  renderProperties();
});

async function createProperty(property) {      
    console.log(property);    
    const res = await fetch('http://localhost:3001/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
    });

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized        
        throw new Error(`Create property failed with status: ${res.status}`);        
    }

    const data = await res.json();
    return data.property;
}

async function updateProperty(property) {
  
    const res = await fetch(`http://localhost:3001/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
    });

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized        
        throw new Error(`Update property failed with status: ${res.status}`);        
    }

    const data = await res.json();
    return data.property;
}

async function deleteProperty(id) {
  console.log(id)      
    const res = await fetch(`http://localhost:3001/properties/${id}`, {
        method: 'DELETE'        
    });

    if (!res.ok) {
        if (res.status === 401) return null; // Unauthorized        
        throw new Error(`Delete property failed with status: ${res.status}`);        
    }

    const data = await res.json();
    return data;
}

document?.getElementById("addNewPropertyButton").addEventListener("click", function (e) {
  showForm();
});

document?.getElementById("cancelButton").addEventListener("click", function (e) {
  const propertyForm = document?.getElementById("addPropertyForm");
  const propertyList = document?.getElementById("propertyList");
  const addNewPropertyButton = document?.getElementById("addNewPropertyButton");
  propertyForm.classList.add("hidden");
  propertyList.classList.remove("hidden");
  addNewPropertyButton.classList.remove("hidden");
});

function showForm(){
  const propertyForm = document?.getElementById("addPropertyForm");
  const propertyList = document?.getElementById("propertyList");
  const addNewPropertyButton = document?.getElementById("addNewPropertyButton");
  propertyForm.classList.remove("hidden");
  propertyList.classList.add("hidden");
  addNewPropertyButton.classList.add("hidden");

}

async function viewPropertyDetails(index){
  //show modal
  const workspaceModal = document?.getElementById("workspaceModal");
  workspaceModal.classList.remove("hidden");
  

  //get workspace list container
  const workspaceConatiner = document?.getElementById("workspaceList");

  //get workspaces from database  
  const workspaces = await getWorkspaces(index);
  console.log(workspaces);

  workspaces.forEach((work, index) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';

    card.innerHTML = `
      <div class="bg-gray-200 h-40 flex items-center justify-center">
        <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-2">${work?.name || 'No Address'}</h3>
        <p class="text-sm text-gray-600 mb-4">${work?.decription}</p>
        <p class="text-sm text-gray-600 mb-4">${work?.type_of_room.toUpperCase()} (${work?.capacity})</p>
        <p className="text-sm text-gray-600 mb-4">
          ${work?.price != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(work.price) : '—'}
        </p>
        <div class="flex items-center justify-end  mt-4">
          <!-- Edit + Delete Icons -->
          <div class="flex gap-2">
            <button class="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg shadow transition duration-150" onclick="startEditWorkspace(${work?.workspace_id})" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
              </svg>
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition duration-150" onclick="startDeleteWorkspace(${work?.workspace_id})" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
              </svg>
            </button>
          </div>
          
        </div>
        
        
      </div>
    `;

    workspaceConatiner.appendChild(card);
  });

}

document?.getElementById("cancelWorkspaceBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const workspaceModal = document?.getElementById("workspaceModal");
  const workspaceConatiner = document?.getElementById("workspaceList");
  workspaceModal.classList.add("hidden"); 
  workspaceConatiner.innerHTML = '';
});

document?.getElementById("addWorkspaceBtn").addEventListener("click", function (e) {
  e.preventDefault();
  alert("New workspace");
});

async function getWorkspaces(idProperty){  
  const res = await fetch(`http://localhost:3001/workspaces/property/${idProperty}`);

  if (!res.ok) {
      if (res.status === 401) return null; // Unauthorized        
      throw new Error(`get property's workspaces failed with status: ${res.status}`);        
  }

  const data = await res.json();
  return data;
}


document.getElementById('propertyImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const previewImg = document.getElementById('imagePreview');
      previewImg.src = e.target.result;

      // Show the preview container
      document.getElementById('imagePreviewContainer').classList.remove('hidden');
    };

    reader.readAsDataURL(file);
  });