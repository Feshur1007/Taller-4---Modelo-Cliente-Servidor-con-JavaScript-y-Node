import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm } from "./ui/ui.js";
import { initTheme } from "./theme.js";

const form = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
const errorBox = document.getElementById("formError");
let editingId = null;

initTheme("theme-toggle");

tableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.classList.contains("btn-delete")) {
        try {
            await deleteItem(id);
            loadItems();
        } catch (err) {
            console.error("Error eliminando:", err);
            errorBox.textContent = err.message;
        }
    } else if (btn.classList.contains("btn-edit")) {
        try {
            if (editingId === id) {
                resetForm(form, submitBtn);
                editingId = null;
                return;
            }
            const item = await getItem(id);
            fillForm(form, item, submitBtn);
            editingId = id;
        } catch (err) {
            console.error("Error cargando item:", err);
            alert("No se pudo cargar el item para edición.");
        }
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value;
    const description = form.querySelector("#description").value;
    const price = Number(form.querySelector("#price").value);
    const category = form.querySelector("#category").value;
    const cantidad = Number(form.querySelector("#cantidad").value);
    const fecha = form.querySelector("#fecha").value;

    if (!name) {
        errorBox.textContent = "El campo nombre es obligatorio";
        return;
    }

    if (!price || !category || isNaN(cantidad) || !fecha) {
        errorBox.textContent = "Los campos precio, categoria, cantidad y fecha son obligatorios";
        return;
    }

    errorBox.textContent = "";

    try {
        if (editingId) {
            await updateItem(editingId, { name, description, price, category, cantidad, fecha });
            editingId = null;
        } else {
            await createItem({ name, description, price, category, cantidad, fecha });
        }

        resetForm(form, submitBtn);
        loadItems();
    } catch (err) {
        console.error("Error guardando item:", err);
        errorBox.textContent = err.message;
    }
});

async function loadItems() {
    try {
        const items = await getItems();
        renderItems(items, tableBody);
    } catch (err) {
        console.error("Error cargando lista:", err);
        alert("No se pudieron cargar los items.");
    }
}

loadItems();
