// frontend/js/admin.js
const API_URL = 'http://localhost:5000/api/admin'; // change as per backend setup

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  const res = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, email, password, role })
  });

  const data = await res.json();
  alert(data.message);
  fetchUsers();
  e.target.reset();
});

// Fetch and display users
async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  const users = await res.json();
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.blocked ? 'Blocked' : 'Active'}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
        <button class="btn btn-sm btn-warning" onclick="toggleBlock('${user._id}', ${user.blocked})">
          ${user.blocked ? 'Unblock' : 'Block'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Delete user
async function deleteUser(id) {
  if (!confirm('Are you sure?')) return;
  const res = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
  const data = await res.json();
  alert(data.message);
  fetchUsers();
}

// Block/Unblock user
async function toggleBlock(id, isBlocked) {
  const res = await fetch(`${API_URL}/block/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ block: !isBlocked })
  });
  const data = await res.json();
  alert(data.message);
  fetchUsers();
}

// Initial fetch
fetchUsers();
