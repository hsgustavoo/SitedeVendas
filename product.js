// Array para armazenar os produtos
let pageProducts = [];

// Função para validar os campos
function validateFields(name, username, email, phone, website) {
    const errors = [];

    // Validações gerais
    const textFields = [
        { field: "Título", value: name },
        { field: "Descrição", value: username },
        { field: "Marca", value: email },
        { field: "Categoria", value: phone }
    ];

    // Verificação de comprimento para campos de texto
    textFields.forEach(({ field, value }) => {
        if (value.trim().length < 3 || value.trim().length > 50) {
            errors.push(`${field} deve ter entre 3 e 50 caracteres.`);
        }
    });

    // Validação de preço
    if (!website || isNaN(website) || website <= 0 || website >= 120) {
        errors.push("Preço deve ser um número positivo menor que 120.");
    }

    return errors;
}

// Função para adicionar um produto
function addProduct() {
    const addProductForm = document.getElementById("add-user-form");

    // Obtendo os valores do formulário
    const id = pageProducts.length ? pageProducts[pageProducts.length - 1].id + 1 : 1;
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const website = parseFloat(document.getElementById("website").value);
    const photoInput = document.getElementById("photo-upload");
    const photo = photoInput.files.length ? document.getElementById("preview-img").src : '';

    // Realiza a validação
    const errors = validateFields(name, username, email, phone, website);

    if (errors.length > 0) {
        alert(errors.join("\n")); // Exibe os erros encontrados
        return;
    }

    // Adiciona o produto se não houver erros
    pageProducts.push({ id, name, username, email, phone, website, photo });
    saveProductsToStorage(); // Salva os novos produtos no localStorage
    addProductForm.reset();
    document.getElementById("photo-preview").style.display = "none"; // Oculta prévia da foto
    displayProducts(); // Exibe os produtos atualizados
}

// Função para exibir a lista de produtos
function displayProducts() {
    const productList = document.getElementById("user-list");
    productList.innerHTML = ""; // Limpa a lista antes de exibir
    pageProducts.forEach(product => {
        const listItem = document.createElement("li");
        listItem.setAttribute("class", "card");

        // Exibe os dados do produto e o botão de remoção
        listItem.innerHTML = `
            <div class="space"><strong>Título:</strong> ${product.name}</div>
            <div class="space"><strong>Descrição:</strong> ${product.username}</div>
            <div class="space"><strong>Marca:</strong> ${product.email}</div>
            <div class="space"><strong>Categoria:</strong> ${product.phone || 'N/A'}</div>
            <div class="space"><strong>Preço:</strong> R$ ${product.website.toFixed(2)}</div>
            <img src="${product.photo || ''}" alt="Foto do produto" class="product-photo" style="display:${product.photo ? 'block' : 'none'};">
            <button onclick="removeProduct(${product.id})" class="remove-btn"><i class="bi bi-trash"></i>Remover</button>
        `;
        productList.appendChild(listItem);
    });
}

// Função para carregar os produtos do localStorage
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        pageProducts = JSON.parse(storedProducts); // Carrega os produtos salvos
    }
    displayProducts(); // Exibe os produtos carregados
}

// Função para salvar os produtos no localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(pageProducts)); // Salva os produtos no localStorage
}

// Função para remover um produto
function removeProduct(productId) {
    pageProducts = pageProducts.filter(product => product.id !== productId);
    saveProductsToStorage(); // Atualiza o localStorage
    displayProducts(); // Exibe a lista de produtos após remoção
}

// Função para exibir a foto do produto ao fazer upload
function previewPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("preview-img").src = e.target.result;
        document.getElementById("photo-preview").style.display = "block"; // Exibe a prévia da imagem
    };
    reader.readAsDataURL(file);
}

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
    loadProductsFromStorage();

    // Evento para adicionar produto
    document.getElementById("add-btn").addEventListener("click", addProduct);

    // Evento para pré-visualização da foto
    document.getElementById("photo-upload").addEventListener("change", previewPhoto);
});
