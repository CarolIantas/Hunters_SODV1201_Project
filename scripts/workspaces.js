//FIELDS
const workspaceName = document?.getElementById('workspaceName');
const workspaceDescription = document?.getElementById('workspaceDescription');
const workspaceType = document?.getElementById('workspaceType');
const workspaceCapacity = document?.getElementById('workspaceCapacity');
const smoking = document?.getElementById('smoking');
const workspaceDate = document?.getElementById('workspaceDate');
const workspaceLeaseTerm = document?.getElementById('workspaceLeaseTerm');
const workspacePrice = document?.getElementById('workspacePrice');
const workspacePhoto = document?.getElementById('workspacePhoto');
const imageWorkspacePreview = document?.getElementById('imageWorkspacePreview');

//EVENTS
document?.getElementById("addWorkspaceBtn").addEventListener("click", function (e) {
  e.preventDefault();
  addNewWorkspace();
});


document?.getElementById('workspacePhoto').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const preview = document.getElementById("imageWorkspacePreview");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('hidden');
  } else {
    preview.src = '';
    preview.classList.add('hidden');
  }
});

//FUNCTIONS

//Attempting to make updates render instead of refreshing
function addNewWorkspace() {
  openModal('editWorkspaceModal');
}

async function startEditWorkspace(index, propertyId) {
  editWorkspaceId = propertyId;
  //get workspace
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];

  //try to get from localStorage
  let ws = workspaces.filter(f => f.workspace_id == index);    

  if (ws.length === 0) {
    //retrive from database    
    ws = await api_getWorkspaceById(index);    
  } else {
    ws = ws[0];
  }

  //set id
  document.getElementById('editWorkspaceId').value = index;


  workspaceName.value = ws.name ? ws.name : "";
  workspaceDescription.value = ws.description ? ws.description : "";
  workspaceType.value = ws.type_of_room ? ws.type_of_room : 0;
  workspaceCapacity.value = ws.capacity ? ws.capacity : 1;  
  // Set from data
  if (ws?.smoking) {
    const radio = ws.smoking == true ? "yes" : "no";
    document.querySelector(`input[name="smoking"][value="${radio}"]`).checked = true;
  }
  workspaceDate.value = ws.date
  ? new Date(ws.date).toISOString().split('T')[0]
  : new Date().toISOString().split('T')[0];
  workspaceLeaseTerm.value = ws.term ? ws.term : "";
  workspacePrice.value = ws.price ? ws.price : 0;
  if (ws.image) {
    imageWorkspacePreview.src = ws.image;
    imageWorkspacePreview.classList.remove("hidden");
  } else {
    imageWorkspacePreview.src = "";
    imageWorkspacePreview.classList.add("hidden");
  }
  

  openModal('editWorkspaceModal');
}

async function saveWorkspaceEdit() {

  const file = workspacePhoto.files[0];  
  const res = await api_saveImage(file); 
  const imageUrl = res.secure_url;

  const smokingInput = document.querySelector('input[name="smoking"]:checked');
  const smokingValue = smokingInput ? (smokingInput.value == "no" ? false : true) : false;

  //updated object 
  wsObject = {    
    property_id: document?.getElementById("addPropertyForm").getAttribute("property_id"),
    name: workspaceName.value,
    description: workspaceDescription.value,
    type_of_room: workspaceType.value,
    capacity: workspaceCapacity.value,
    smoking: smokingValue,
    date: workspaceDate.date,
    term: workspaceLeaseTerm.value, 
    price: workspacePrice.value,
    image: imageUrl
  }

  //get workspaces id
  const workspaceId = document.getElementById('editWorkspaceId').value;
  let newWS;
  //update/create database
  if (workspaceId > 0){
    wsObject.workspace_id = workspaceId;
    newWS = await api_updateWorkspace(workspaceId, wsObject); 
  } else {
    newWS = await api_createWorkspace(wsObject);    
  }

  //update local storage
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];  
  if (workspaces.length > 0) {
    const indexWS = workspaces.findIndex(f => f.workspace_id === workspaceId);
    if (indexWS > -1){
      wsObject.workspace_id = workspaceId;
      workspaces[indexWS] = wsObject;
    } else {
      workspaces.push(newWS);
    }
  };

  //update  
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  
  //clear form and close modal
  clearWorkspaceModalData();
  
  //update workspaces
  viewPropertyDetails(document?.getElementById("addPropertyForm").getAttribute("property_id"));
}

function clearWorkspaceModalData() {
   //clear data
  workspaceName.value = "";
  workspaceDescription.value = "";
  workspaceType.value = "";
  workspaceCapacity.value = "";  
  workspaceDate.value = "";
  workspaceLeaseTerm.value = "";
  workspacePrice.value = "";
  workspacePhoto.value = "";
  imageWorkspacePreview.src = "";
  imageWorkspacePreview.classList.add("hidden");
  closeModal('editWorkspaceModal');
}

function startDeleteWorkspace(index) {
  document.getElementById('deleteWorkspaceId').value = index;
  openModal('deleteWorkspaceModal');
}

async function confirmWorkspaceDelete() {  
  const workspaceId = document.getElementById('deleteWorkspaceId').value;
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || []

  //delete from database
  await api_deleteWorkspace(workspaceId);
  
  //delete from localstorage
  const indWS = workspaces.findIndex(f => f.workspace_id == workspaceId);
  if (indWS > -1){
    workspaces.splice(indWS, 1);  
  };
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  
  //close delete modal
  closeModal('deleteWorkspaceModal');
  
  //update workspaces
  viewPropertyDetails(document?.getElementById("addPropertyForm").getAttribute("property_id"));
}

function handleDelist() {
  // Replace with your delist logic
  alert('Delisting workspace...');
}