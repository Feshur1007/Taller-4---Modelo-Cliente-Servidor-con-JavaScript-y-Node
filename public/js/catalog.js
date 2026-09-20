import { getItems, getItem } from "./services/api.js";

const catalogContainer = document.getElementById("catalogContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

async function loadCatalog() {
    try {
        const filtros = {};
        if (searchInput.value) filtros.q = searchInput.value;
        if (categoryFilter.value) filtros.categoria = categoryFilter.value;
        if (sortSelect.value) filtros.sort = sortSelect.value;
        const items = await getItems(filtros);
        catalogContainer.innerHTML = "";
        items.forEach(item => renderItem(item));
    } catch (err) {
        console.error("Error cargando catalogo:", err);
        catalogContainer.innerHTML = "<p>No se pudo cargar el catalogo.</p>";
    }
}

function renderItem(item) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <h3>${item.name}</h3>
        <p class="category">${item.category || ""}</p>
        <p class="price">$${item.price}</p>
        <p class="cantidad">Cantidad: ${item.cantidad}</p>
        <p class="fecha">${item.fecha || ""}</p>
        <button data-id="${item.id}">Ver detalle</button>
    `;
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => openModal(item.id));
    catalogContainer.appendChild(card);
}

async function openModal(id) {
    try {
        const item = await getItem(id);
        modalBody.innerHTML = `
            <h2>${item.name}</h2>
            <p><strong>Categoria:</strong> ${item.category || ""}</p>
            <p><strong>Precio:</strong> $${item.price}</p>
            <p><strong>Cantidad:</strong> ${item.cantidad}</p>
            <p><strong>Fecha:</strong> ${item.fecha || ""}</p>
            <p>${item.description || ""}</p>
        `;
        modal.style.display = "flex";
    } catch (err) {
        console.error("Error cargando detalle:", err);
        alert("No se pudo cargar el detalle del libro.");
    }
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

searchInput.addEventListener("input", loadCatalog);
categoryFilter.addEventListener("change", loadCatalog);
sortSelect.addEventListener("change", loadCatalog);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

loadCatalog();
