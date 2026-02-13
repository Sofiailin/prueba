const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

function mostrarSeccion(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${id}-section`).classList.remove('hidden');
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje);
        token = data.token;
        localStorage.setItem('token', token);
        renderDashboard();
    } catch (err) {
        document.getElementById('error-msg').innerText = err.message;
    }
}

function renderDashboard() {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;
    document.getElementById('welcome-msg').innerText = `¡Hola, ${payload.username}!`;
    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) btnAdd.style.display = (role === 'duenio') ? 'none' : 'block';
    mostrarSeccion('dashboard');
    loadPets(role);
}

async function loadPets(role) {
    const res = await fetch(`${API_URL}/pets`, { headers: { 'Authorization': `Bearer ${token}` } });
    const pets = await res.json();
    const container = document.getElementById('lista-mascotas');
    container.innerHTML = '';
    pets.forEach(p => {
        const canAction = (role === 'admin' || role === 'veterinario');
        const actions = canAction ? `
            <div class="pet-actions">
                <button onclick="openModal('${p._id}', '${p.nombre}', '${p.especie}', '${p.edad}', '${p.duenioId?._id}')">✏️</button>
                <button onclick="deletePet('${p._id}')">🗑️</button>
            </div>` : '';
        container.innerHTML += `
            <div class="pet-card">
                <h4>${p.nombre}</h4>
                <p>${p.especie} - ${p.edad} años</p>
                <small>Dueño: ${p.duenioId?.username || 'N/A'}</small>
                ${actions}
            </div>`;
    });
}

async function openModal(id = '', nombre = '', especie = '', edad = '', duenioId = '') {
    document.getElementById('pet-id').value = id;
    document.getElementById('pet-nombre').value = nombre;
    document.getElementById('pet-especie').value = especie;
    document.getElementById('pet-edad').value = edad;
    await loadOwners(duenioId);
    document.getElementById('modal-mascota').classList.remove('hidden');
}

async function loadOwners(selectedId) {
    const res = await fetch(`${API_URL}/users/duenios`, { headers: { 'Authorization': `Bearer ${token}` } });
    const owners = await res.json();
    const select = document.getElementById('pet-duenio-id');
    select.innerHTML = '<option value="">Seleccionar Dueño...</option>';
    owners.forEach(o => {
        const selected = o._id === selectedId ? 'selected' : '';
        select.innerHTML += `<option value="${o._id}" ${selected}>${o.username}</option>`;
    });
}

async function guardarMascota() {
    const id = document.getElementById('pet-id').value;
    const body = {
        nombre: document.getElementById('pet-nombre').value,
        especie: document.getElementById('pet-especie').value,
        edad: document.getElementById('pet-edad').value,
        duenioId: document.getElementById('pet-duenio-id').value
    };
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${API_URL}/pets/${id}` : `${API_URL}/pets`;
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
    });
    if (res.ok) {
        document.getElementById('modal-mascota').classList.add('hidden');
        renderDashboard();
    }
}

if (token) renderDashboard();