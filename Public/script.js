const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// --- Control de Navegación ---
function mostrarSeccion(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${id}-section`).classList.remove('hidden');
}

// --- Autenticación ---
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
        if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
        token = data.token;
        localStorage.setItem('token', token);
        renderDashboard();
    } catch (err) {
        alert(err.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

// --- Dashboard y Renderizado ---
function renderDashboard() {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Cambiar botón "Acceso" por "Salir"
    document.getElementById('btn-login-nav').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('user-name-display').innerText = payload.username;
    
    document.getElementById('welcome-msg').innerText = `¡Hola, ${payload.username}!`;
    
    // Ocultar botón Agregar si es dueño
    const btnAdd = document.querySelector('.btn-add');
    if (payload.role === 'duenio') btnAdd.style.display = 'none';
    else btnAdd.style.display = 'block';

    mostrarSeccion('dashboard');
    loadPets(payload.role);
}

async function loadPets(role) {
    const res = await fetch(`${API_URL}/pets`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const pets = await res.json();
    const container = document.getElementById('lista-mascotas');
    container.innerHTML = '';

    pets.forEach(p => {
        const canAction = role === 'admin' || role === 'veterinario';
        const actions = canAction ? `
            <div class="pet-actions">
                <button class="btn-edit-card" onclick="openModal('${p._id}', '${p.nombre}', '${p.especie}', '${p.edad}', '${p.duenioId?._id}')">Editar ✏️</button>
                <button class="btn-delete-card" onclick="deletePet('${p._id}')">Borrar 🗑️</button>
            </div>` : '';

        container.innerHTML += `
            <div class="pet-card">
                <div class="pet-header-card">
                    <h2>${p.nombre}</h2>
                    ${actions}
                </div>
                <div class="pet-info-grid">
                    <div class="info-item"><strong>Especie:</strong> ${p.especie}</div>
                    <div class="info-item"><strong>Edad:</strong> ${p.edad} años</div>
                </div>
                <div class="medical-info-box">
                    <p><strong>📋 Descripción:</strong> ${p.descripcion || 'Chequeo general'}</p>
                    <p><strong>🩺 Diagnóstico:</strong> ${p.diagnostico || 'Saludable'}</p>
                    <p><strong>💊 Tratamiento:</strong> ${p.tratamiento || 'Ninguno'}</p>
                </div>
                <small>Dueño: ${p.duenioId?.username || 'N/A'}</small>
            </div>`;
    });
}

// --- Gestión de Modal (Botón Agregar y Cancelar) ---
async function openModal(id = '', nombre = '', especie = '', edad = '', duenioId = '') {
    document.getElementById('pet-id').value = id;
    document.getElementById('pet-nombre').value = nombre;
    document.getElementById('pet-especie').value = especie;
    document.getElementById('pet-edad').value = edad;
    
    document.getElementById('modal-titulo').innerText = id ? 'Editar Mascota' : 'Nueva Mascota';
    await loadOwners(duenioId);
    document.getElementById('modal-mascota').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-mascota').classList.add('hidden');
}

// --- Eliminar (Con Token) ---
async function deletePet(id) {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;
    try {
        const res = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) renderDashboard();
        else alert('No autorizado');
    } catch (e) { console.error(e); }
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

    if (res.ok) { closeModal(); renderDashboard(); }
}

if (token) renderDashboard();