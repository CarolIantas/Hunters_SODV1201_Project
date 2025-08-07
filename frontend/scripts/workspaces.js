//still adjusting
//Attempting to make updates render instead of refreshing

function addNewWorkspace() {
  openModal('editWorkspaceModal');
}

function startEditWorkspace(index) {
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
  const ws = workspaces[index];
  document.getElementById('editWorkspaceId').value = index;
  document.getElementById('editWorkspaceType').value = ws.type;
  document.getElementById('editWorkspaceCapacity').value = ws.capacity;
  openModal('editWorkspaceModal');
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
