const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentPetId = null; 

window.onload = () => {
    if (token && token !== 'null') renderDashboard();
    else mostrarSeccion('home'); // <--- CAMBIADO A mostrarSeccion
};

// --- AQUÍ ESTABA EL ERROR: Ahora se llama igual que en el HTML ---
function mostrarSeccion(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    
    const section = document.getElementById(`${id}-section`);
    if (section) section.classList.remove('hidden');
    
    if (id === 'home' && !token) {
        document.getElementById('btn-login-nav').classList.remove('hidden');
        document.getElementById('user-info').classList.add('hidden');
    }
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
        
        if (res.ok) {
            localStorage.setItem('token', data.token);
            token = data.token;
            renderDashboard();
        } else {
            document.getElementById('error-msg').innerText = "Credenciales incorrectas";
        }
    } catch (e) {
        document.getElementById('error-msg').innerText = "Error de conexión";
    }
}

function renderDashboard() {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;
    const username = payload.username;

    let saludo = role === 'veterinario' ? `¡Hola, Dra. ${username}!` : `¡Hola, ${username}!`;
    document.getElementById('user-name-display').innerText = username;
    document.getElementById('welcome-msg').innerHTML = `<span class="role-badge">${role}</span><br>${saludo}`;

    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) btnAdd.style.display = (role === 'duenio') ? 'none' : 'block';

    document.getElementById('btn-login-nav').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');

    mostrarSeccion('dashboard'); // <--- CAMBIADO A mostrarSeccion
    loadPets(role);
}

async function loadPets(role) {
    const res = await fetch(`${API_URL}/pets`, { headers: { 'Authorization': `Bearer ${token}` } });
    const pets = await res.json();
    const container = document.getElementById('lista-mascotas');
    container.innerHTML = '';

    pets.forEach(p => {
        const isStaff = (role === 'admin' || role === 'veterinario');
        const actions = isStaff ? `
            <div class="pet-actions">
                <button onclick="openModal('${p._id}', '${p.nombre}', '${p.especie}', '${p.edad}', '${p.duenioId?._id || ''}')"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deletePet('${p._id}')"><i class="fa-solid fa-trash"></i></button>
            </div>` : '';

        const ownerName = p.duenioId?.username || p.duenio?.username || 'Sin asignar';
        container.innerHTML += `
            <div class="pet-card">
                <div class="pet-info">
                    <h4>${p.nombre}</h4>
                    <p>${p.especie} • ${p.edad} años</p>
                    <small><i class="fa-solid fa-user"></i> ${ownerName}</small>
                </div>
                ${actions}
            </div>`;
    });
}

async function loadOwners(selectedId = "") {
    const select = document.getElementById('pet-duenio-id');
    select.innerHTML = '<option value="">Cargando...</option>';
    try {
        const res = await fetch(`${API_URL}/users/duenios`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const users = await res.json();
            select.innerHTML = '<option value="">Seleccionar Dueño...</option>';
            users.forEach(u => {
                const isSelected = (u._id === selectedId) ? 'selected' : '';
                select.innerHTML += `<option value="${u._id}" ${isSelected}>${u.username} (${u.email})</option>`;
            });
        }
    } catch (e) { select.innerHTML = '<option value="">Error cargando lista</option>'; }
}

async function openModal(id = null, nombre = "", especie = "", edad = "", duenioId = "") {
    currentPetId = id;
    document.getElementById('modal-titulo').innerText = id ? "Editar Mascota" : "Nueva Mascota";
    document.getElementById('pet-nombre').value = nombre;
    document.getElementById('pet-especie').value = especie;
    document.getElementById('pet-edad').value = edad;
    await loadOwners(duenioId);
    document.getElementById('modal-mascota').classList.remove('hidden');
}

function closeModal() { document.getElementById('modal-mascota').classList.add('hidden'); }

async function guardarMascota() {
    const payload = {
        nombre: document.getElementById('pet-nombre').value,
        especie: document.getElementById('pet-especie').value,
        edad: document.getElementById('pet-edad').value,
        duenioId: document.getElementById('pet-duenio-id').value
    };
    const method = currentPetId ? 'PATCH' : 'POST';
    const url = currentPetId ? `${API_URL}/pets/${currentPetId}` : `${API_URL}/pets`;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
    });
    closeModal();
    renderDashboard();
}

async function deletePet(id) {
    if (confirm("¿Borrar mascota?")) {
        await fetch(`${API_URL}/pets/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        renderDashboard();
    }
}

function logout() { localStorage.removeItem('token'); window.location.reload(); }