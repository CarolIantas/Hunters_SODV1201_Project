//still adjusting
//Attempting to make updates render instead of refreshing

function addNewWorkspace() {
  openModal('editWorkspaceModal');
}

async function startEditWorkspace(index) {
  console.log(index)
  //get workspace
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];

  //try to get from localStorage
  let ws = workspaces.filter(f => f.workspace_id == index);

  if (ws.length === 0) {
    //retrive from database
    ws = await getWorkspaceById(index);
    console.log(ws);
  }

  //set id
  document.getElementById('editWorkspaceId').value = index;


  //fill form
  const workspaceName = document.getElementById('workspaceName');
  const workspaceDescription = document.getElementById('workspaceDescription');
  const workspaceType = document.getElementById('workspaceType');
  const workspaceCapacity = document.getElementById('workspaceCapacity');
  const smoking = document.getElementById('smoking');
  const workspaceDate = document.getElementById('workspaceDate');
  const workspaceLeaseTerm = document.getElementById('workspaceLeaseTerm');
  const workspacePrice = document.getElementById('workspacePrice');
  const workspacePhoto = document.getElementById('workspacePhoto');
  const imageWorkspacePreview = document.getElementById('imageWorkspacePreview');

  workspaceName.value = ws.name ? ws.name : "";
  workspaceDescription.value = ws.decription ? ws.decription : "";
  workspaceType.value = ws.type_of_room ? ws.type_of_room : 0;
  workspaceCapacity.value = ws.capacity ? ws.capacity : 1;
  //smoking.value = ws.smoking ? ws.smoking : false;
  workspaceDate.date  = ws.date ? ws.date : new Date();
  workspaceLeaseTerm.value = ws.term ? ws.term : "";
  workspacePrice.value = ws.price ? ws.price : 0;
  

  openModal('editWorkspaceModal');
}

async function getWorkspaceById(index) {

  const res = await fetch(`http://localhost:3001/workspaces/${index}`);

  if (!res.ok) {
    if (res.status === 401) return null; // Unauthorized        
    throw new Error(`get property's workspaces failed with status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

function saveWorkspaceEdit() {
  const index = document.getElementById('editWorkspaceId').value;
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
  workspaces[index].type = document.getElementById('editWorkspaceType').value;
  workspaces[index].capacity = parseInt(document.getElementById('editWorkspaceCapacity').value);
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  closeModal('editWorkspaceModal');
  renderWorkspaces();
}

function startDeleteWorkspace(index) {
  document.getElementById('deleteWorkspaceId').value = index;
  openModal('deleteWorkspaceModal');
}

function confirmWorkspaceDelete() {
  const index = document.getElementById('deleteWorkspaceId').value;
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
  workspaces.splice(index, 1);
  localStorage.setItem('workspaces', JSON.stringify(workspaces));
  closeModal('deleteWorkspaceModal');
  renderWorkspaces();
}

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

function handleDelist() {
  // Replace with your delist logic
  alert('Delisting workspace...');
}