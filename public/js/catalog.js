import { getItems, getItem } from "./services/api.js";
import { renderCatalog, showCatalogLoading, showCatalogEmpty, showCatalogError, showItemModal, hideItemModal } from "./ui/ui.js";
import { initTheme } from "./theme.js";

const catalogContainer = document.getElementById("catalogContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

initTheme("theme-toggle");

async function loadCatalog() {
    showCatalogLoading(catalogContainer);
    try {
        const filtros = {};
        if (searchInput.value) filtros.q = searchInput.value;
        if (categoryFilter.value) filtros.categoria = categoryFilter.value;
        if (sortSelect.value) filtros.sort = sortSelect.value;
        const items = await getItems(filtros);
        if (items.length === 0) {
            const buscando = searchInput.value !== "" || categoryFilter.value !== "";
            showCatalogEmpty(catalogContainer, buscando);
            return;
        }
        renderCatalog(items, catalogContainer);
    } catch (err) {
        console.error("Error cargando catalogo:", err);
        showCatalogError(catalogContainer);
    }
}

async function openModal(id) {
    try {
        const item = await getItem(id);
        showItemModal(modal, modalBody, item);
    } catch (err) {
        console.error("Error cargando detalle:", err);
        alert("No se pudo cargar el detalle del libro.");
    }
}

catalogContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (btn) openModal(Number(btn.dataset.id));
});

closeModal.addEventListener("click", () => {
    hideItemModal(modal);
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        hideItemModal(modal);
    }
});

searchInput.addEventListener("input", loadCatalog);
categoryFilter.addEventListener("change", loadCatalog);
sortSelect.addEventListener("change", loadCatalog);

loadCatalog();
