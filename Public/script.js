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
    const errorMsg = document.getElementById('error-msg');

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || 'Error al ingresar');

        token = data.token;
        localStorage.setItem('token', token);
        renderDashboard();
    } catch (err) {
        errorMsg.innerText = err.message;
    }
}

function logout() {
    localStorage.removeItem('token');
    token = null;
    location.reload();
}

// --- Dashboard y Lógica de Permisos ---
function renderDashboard() {
    if (!token) return;
    
    // Decodificar el JWT para obtener el rol y nombre (asumiendo estructura estándar)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role;
    const username = payload.username;

    document.getElementById('user-name-display').innerText = username;
    document.getElementById('welcome-msg').innerText = `¡Hola, ${username}!`;

    // REQUISITO: Ocultar botón "Nueva Mascota" si el usuario es dueño
    const btnAdd = document.querySelector('.btn-add');
    if (role === 'duenio') {
        btnAdd.style.display = 'none';
    } else {
        btnAdd.style.display = 'block';
    }

    document.getElementById('btn-login-nav').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');

    mostrarSeccion('dashboard');
    loadPets(role);
}

async function loadPets(role) {
    const res = await fetch(`${API_URL}/pets`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const pets = await res.json();
    const container = document.getElementById('lista-mascotas');
    container.innerHTML = '';

    pets.forEach(p => {
        // Solo Admin y Veterinario ven botones de acción
        const canAction = role === 'admin' || role === 'veterinario';
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

// --- Gestión de Modal y Mascotas ---
async function openModal(id = '', nombre = '', especie = '', edad = '', duenioId = '') {
    document.getElementById('pet-id').value = id;
    document.getElementById('pet-nombre').value = nombre;
    document.getElementById('pet-especie').value = especie;
    document.getElementById('pet-edad').value = edad;
    
    document.getElementById('modal-titulo').innerText = id ? 'Editar Mascota' : 'Nueva Mascota';
    
    // REQUISITO: El veterinario puede asociar mascotas a dueños
    await loadOwners(duenioId);
    
    document.getElementById('modal-mascota').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-mascota').classList.add('hidden');
}

async function loadOwners(selectedId) {
    try {
        const res = await fetch(`${API_URL}/users/duenios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const owners = await res.json();
        const select = document.getElementById('pet-duenio-id');
        select.innerHTML = '<option value="">Seleccionar Dueño...</option>';
        
        owners.forEach(o => {
            const selected = o._id === selectedId ? 'selected' : '';
            select.innerHTML += `<option value="${o._id}" ${selected}>${o.username}</option>`;
        });
    } catch (e) {
        console.error("Error al cargar dueños:", e);
    }
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

    try {
        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            closeModal();
            const payload = JSON.parse(atob(token.split('.')[1]));
            loadPets(payload.role);
        } else {
            const data = await res.json();
            alert(data.mensaje || "Error al guardar");
        }
    } catch (e) {
        console.error(e);
    }
}

async function deletePet(id) {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;

    try {
        const res = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            loadPets(payload.role);
        }
    } catch (e) {
        console.error(e);
    }
}

// Al cargar la página
if (token) {
    renderDashboard();
}