// Array para armazenar os usuários
let users = [];

// Função para exibir a lista de usuários
function displayUsers() {
    const userList = document.createElement("ul");
    userList.setAttribute("id", "user-list"); // Adiciona ID à lista
    const container = document.querySelector(".container");
    const existingList = document.getElementById("user-list");

    if (existingList) {
        existingList.remove(); // Remove a lista anterior
    }

    container.appendChild(userList);

    users.forEach(user => {
        const listItem = document.createElement("li");
        listItem.setAttribute("class", "card");

        listItem.innerHTML = `
            <div class="space"><strong>Nome:</strong> ${user.name}</div>
            <div class="space"><strong>Sobrenome:</strong> ${user.username}</div>
            <div class="space"><strong>Email:</strong> ${user.email}</div>
            <div class="space"><strong>Idade:</strong> ${user.age}</div>
            <img src="${user.photo || ''}" alt="Foto do usuário" class="user-photo" style="display:${user.photo ? 'block' : 'none'};">
            <button onclick="removeUser(${user.id})" class="remove-btn">Remover</button>
        `;

        userList.appendChild(listItem);
    });
}

// Função para carregar os usuários do localStorage
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    displayUsers();
}

// Função para salvar os usuários no localStorage
function saveUsersToStorage() {
    localStorage.setItem("users", JSON.stringify(users));
}

// Função para adicionar um novo usuário com validação
function addUser() {
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const age = parseInt(document.getElementById("age").value.trim(), 10);
    const photo = document.getElementById("preview-img").src || "";

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Validações
    if (name.length < 3 || name.length > 50) {
        alert("O campo Nome deve ter entre 3 e 50 caracteres.");
        return;
    }
    if (username.length < 3 || username.length > 50) {
        alert("O campo Sobrenome deve ter entre 3 e 50 caracteres.");
        return;
    }
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }
    if (isNaN(age) || age <= 0 || age > 120) {
        alert("O campo Idade deve conter um número entre 1 e 120.");
        return;
    }

    const id = users.length ? users[users.length - 1].id + 1 : 1;
    users.push({ id, name, username, email, age, photo });

    saveUsersToStorage();
    displayUsers();
    document.getElementById("add-user-form").reset();
    document.getElementById("preview-img").src = "";
    document.getElementById("photo-preview").style.display = "none";
}

// Função para remover um usuário
function removeUser(userId) {
    users = users.filter(user => user.id !== userId);
    saveUsersToStorage();
    displayUsers();
}

// Função para exibir a foto do usuário ao fazer upload
function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("preview-img").src = e.target.result;
            document.getElementById("photo-preview").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    loadUsersFromStorage();
    document.getElementById("add-btn").addEventListener("click", addUser);
    document.getElementById("photo-upload").addEventListener("change", previewPhoto);
});

