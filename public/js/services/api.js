const API_URL = "/api/items";

export async function getItems(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.q) params.set("q", filtros.q);
    if (filtros.categoria) params.set("categoria", filtros.categoria);
    if (filtros.sort) params.set("sort", filtros.sort);
    const query = params.toString();
    const url = query ? API_URL + "?" + query : API_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al cargar items");
    return res.json();
}

export async function getItem(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Item no encontrado");
    return res.json();
}

export async function createItem(data) {
    if (!navigator.onLine) throw new Error("No disponible sin conexión");
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error((error.errors && error.errors.join(" ")) || "Error al crear item");
    }
    return res.json();
}

export async function updateItem(id, data) {
    if (!navigator.onLine) throw new Error("No disponible sin conexión");
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error((error.errors && error.errors.join(" ")) || "Error al actualizar item");
    }
    return res.json();
}

export async function deleteItem(id) {
    if (!navigator.onLine) throw new Error("No disponible sin conexión");
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar item");
    return res.json();
}
