function Workspaces() {
    console.log("Workspace function called");
    // Add your workspace logic here
}

//Attempting to make updates render instead of refreshing

function renderWorkspaces() {
  const workspaces = JSON.parse(localStorage.getItem('workspaces')) || [];
  const container = document.getElementById('workspaceList');
  container.innerHTML = '';
  workspaces.forEach((ws, index) => {
    const div = document.createElement('div');
    div.className = 'p-4 border rounded mb-2';
    div.innerHTML = `
      <p><strong>Type:</strong> ${ws.type}</p>
      <p><strong>Capacity:</strong> ${ws.capacity}</p>
      <button class="px-2 py-1 bg-blue-500 text-white rounded" onclick="startEditWorkspace(${index})">Edit</button>
      <button class="px-2 py-1 bg-red-500 text-white rounded" onclick="startDeleteWorkspace(${index})">Delete</button>
    `;
    container.appendChild(div);
  });
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

document.addEventListener('DOMContentLoaded', renderWorkspaces);
