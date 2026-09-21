const API_URL = "/api/items";
const JSON_HEADERS = { "Content-Type": "application/json" };

async function request(url, options) {
	const res = await fetch(url, options);
	if (!res.ok) {
		let message = "Error " + res.status;
		try {
			const body = await res.json();
			if (body.errors) message = body.errors.join(" ");
			else if (body.error) message = body.error;
		} catch (e) {}
		throw new Error(message);
	}
	return res.json();
}

function offline() {
	throw new Error("No disponible sin conexión");
}

export function getItems(filtros = {}) {
	const params = new URLSearchParams();
	if (filtros.q) params.set("q", filtros.q);
	if (filtros.categoria) params.set("categoria", filtros.categoria);
	if (filtros.sort) params.set("sort", filtros.sort);
	const query = params.toString();
	return request(query ? API_URL + "?" + query : API_URL);
}

export function getItem(id) {
	return request(API_URL + "/" + id);
}

export function createItem(data) {
	if (!navigator.onLine) offline();
	return request(API_URL, {
		method: "POST",
		headers: JSON_HEADERS,
		body: JSON.stringify(data)
	});
}

export function updateItem(id, data) {
	if (!navigator.onLine) offline();
	return request(API_URL + "/" + id, {
		method: "PUT",
		headers: JSON_HEADERS,
		body: JSON.stringify(data)
	});
}

export function deleteItem(id) {
	if (!navigator.onLine) offline();
	return request(API_URL + "/" + id, { method: "DELETE" });
}
