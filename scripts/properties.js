//FIELDS
  //form fields
  const newPropertyName = document?.getElementById("newPropertyName");
  const newPropertyAddress = document?.getElementById("newPropertyAddress");
  const newPropertyNeighborhood = document?.getElementById("newPropertyNeighborhood");
  const propertyImage = document?.getElementById("propertyImage");
  const newSqft = document?.getElementById("newSqft");
  const parking = document?.getElementById("parking");
  const publicTransportation = document?.getElementById("publicTransportation");
  const listingStatus = document?.getElementById("listingStatus");

//FUNCTIONS
function renderProperties() {
  const properties = JSON.parse(localStorage.getItem('properties')) || [];
  const container = document.getElementById('propertyList');
  container.innerHTML = '';

  properties.forEach((prop, index) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';

    card.innerHTML = `
      <div class="bg-gray-200 h-40 flex items-center justify-center">
        ${prop?.image ? 
          `
            <img src=${prop.image} alt="Workspace Image" class="w-full h-full object-cover"/>

          `
          : 
          `<svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
           </svg>`
          }        
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-2">${prop?.title}</h3>
        <p class="text-sm text-gray-600 mb-4">${prop?.address} - ${prop?.neighborhood || 'No Neighborhood'}</p>
        <div class="flex items-center justify-between mt-4">
          <!-- Edit + Delete Icons -->
          <div class="flex gap-2">
            <button class="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg shadow transition duration-150" onclick="startEditProperty(${prop?.property_id})" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
              </svg>
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition duration-150" onclick="startDeleteProperty(${prop?.property_id})" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" />
              </svg>
            </button>
          </div>

          <!-- Eye Icon -->
          <button class="ml-auto text-blue-600 hover:text-blue-800 transition duration-150" onclick="viewPropertyDetails(${prop?.property_id})" title="View Details">
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
    property = await api_getPropertyById(index);
  }
  //open form
  showForm();

  //form fields
  const newPropertyName = document?.getElementById("newPropertyName");
  const newPropertyAddress = document?.getElementById("newPropertyAddress");
  const newPropertyNeighborhood = document?.getElementById("newPropertyNeighborhood");
  const imagePreviewContainer = document?.getElementById("imagePreviewContainer");
  const imagePreview = document?.getElementById("imagePreview");
  const newSqft = document?.getElementById("newSqft");
  const parking = document?.getElementById("parking");
  const publicTransportation = document?.getElementById("publicTransportation");
  const listingStatus = document?.getElementById("listingStatus");

  newPropertyName.value = property.title;
  newPropertyAddress.value = property.address;
  newPropertyNeighborhood.value = property.neighborhood;
  imagePreview.src = property.image;
  console.log(property.image)
  if (property.image != undefined) {
    imagePreviewContainer.classList.remove("hidden");
  }
  newSqft.value = property.SQ_foot;
  parking.checked = property.parking;
  publicTransportation.checked = property.Public_transport;
  listingStatus.value = property.status;

  document?.getElementById("addPropertyForm").setAttribute("property_id", property.property_id);  
}

function startDeleteProperty(idProperty) {
  document.getElementById('deletePropertyId').value = idProperty;
  openModal('deletePropertyModal');
}

async function confirmPropertyDelete() {

  const idProperty = document.getElementById('deletePropertyId').value;  
    
  //delete from database
  const resDel = await api_deleteProperty(idProperty);

  if (!resDel.ok) {
    //get item in the local storage and delete it
    const properties = JSON.parse(localStorage.getItem('properties')) || [];
    const indexProperty = properties.findIndex(f => f.property_id == idProperty);
    properties.splice(indexProperty, 1);

    localStorage.setItem('properties', JSON.stringify(properties));
    closeModal('deletePropertyModal');
    renderProperties();
  }  
}

function showForm(){

  $("#newPropertyName").val("");
  $("#newPropertyAddress").val("");
  $("#newPropertyNeighborhood").val("");
  $("#propertyImage").val("");
  $("#newSqft").val("");
  $("#parking").val("");
  $("#publicTransportation").val("");
  $("#listingStatus").val("");
  
  const propertyForm = document?.getElementById("addPropertyForm");
  const propertyList = document?.getElementById("propertyList");
  const addNewPropertyButton = document?.getElementById("addNewPropertyButton");
  propertyForm.classList.remove("hidden");
  propertyList.classList.add("hidden");
  addNewPropertyButton.classList.add("hidden");

}

async function viewPropertyDetails(propertyId){
  //show modal
  const workspaceModal = document?.getElementById("workspaceModal");  
  
  document?.getElementById("addPropertyForm").setAttribute("property_id", propertyId);

  //get workspace list container
  const workspaceConatiner = document?.getElementById("workspaceList");
  workspaceConatiner.innerHTML = "";

  //get workspaces from database  
  const workspaces = await api_getWorkspaceByPropertyId(propertyId);  

  workspaceModal.classList.remove("hidden");
  workspaces.forEach((work, index) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';

    card.innerHTML = `
      <div class="bg-gray-200 h-40 flex items-center justify-center">
        ${work?.image ? 
          `
            <img src=${work.image} alt="Workspace Image" class="w-full h-full object-cover"/>

          `
          : 
          `<svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
           </svg>`
          }
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-2">${work?.name || 'No Address'}</h3>        
        <p class="text-sm text-gray-600 mb-4">${work?.description.substr(0,35) || 'No description provided.'}${work?.description.length > 35 ? "..." : ""}</p>
        <p class="text-sm text-gray-600 mb-4">${work?.type_of_room.toUpperCase()} (${work?.capacity})</p>
        <p className="text-sm text-gray-600 mb-4">
          ${work?.price != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(work.price) : '—'}
        </p>
        <div class="flex items-center justify-end  mt-4">
          <!-- Edit + Delete Icons -->
          <div class="flex gap-2">
            <button class="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-lg shadow transition duration-150" onclick="startEditWorkspace(${work?.workspace_id}, ${work?.property_id})" title="Edit">
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

//EVENTS
document?.addEventListener('DOMContentLoaded', renderProperties);

document?.getElementById("addPropertyForm")?.addEventListener("submit", async function (e) {  
  e.preventDefault();

  //save image
  const file = propertyImage.files[0];  
  const res = await api_saveImage(file); 
  const imageUrl = res.secure_url;

  //Set the object:
  const propertyObj = {    
    "user_id": JSON.parse(localStorage.getItem("currentUser")).user_id,
    "title": newPropertyName.value,
    "Public_transport": publicTransportation.checked,
    "image": imageUrl,
    "smoking": true,
    "SQ_foot": newSqft.value,
    "address": newPropertyAddress.value,
    "neighborhood": newPropertyNeighborhood.value,    
    "type_of_properties": "house",
    "parking": parking.checked,
    "status": listingStatus.value,
    "date": new Date(),    
  };

  //check if it is an update or an insert
  const property_id = this.getAttribute("property_id");  
  
  let newOrUpdateProperty;
  if (property_id === null) {
    //insert in the database    
    newOrUpdateProperty = await api_createProperty(propertyObj);    
  } else {
    //update in the database
    propertyObj.property_id = property_id;
    newOrUpdateProperty = await api_updateProperty(property_id, propertyObj); 
  };

  //update local storage
  const propertyLS = JSON.parse(localStorage.getItem("properties"));
  const indexPropLS = propertyLS?.findIndex(f => f.property_id == propertyObj.property_id);
  if (indexPropLS > -1) {
    propertyLS[indexPropLS] = newOrUpdateProperty.property;
  } else {
    propertyLS.push(newOrUpdateProperty.property);    
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

document?.getElementById("addNewPropertyButton").addEventListener("click", function (e) {
  document?.getElementById("addPropertyForm").removeAttribute("property_id");  
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


document?.getElementById("cancelWorkspaceBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const workspaceModal = document?.getElementById("workspaceModal");
  const workspaceConatiner = document?.getElementById("workspaceList");
  workspaceModal.classList.add("hidden"); 
  workspaceConatiner.innerHTML = '';
});

document?.getElementById('propertyImage')?.addEventListener('change', function (event) {
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