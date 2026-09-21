import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "..", "data", "items.json");

export function getAllItems() {
	return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

export function findItem(id) {
	return getAllItems().find((item) => item.id === id);
}

export function insertItem(datos) {
	const items = getAllItems();
	const nuevo = {
		id: Date.now(),
		name: datos.name,
		description: datos.description || "",
		price: datos.price,
		category: datos.category,
		cantidad: datos.cantidad,
		fecha: datos.fecha
	};
	items.push(nuevo);
	fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));
	return nuevo;
}

export function modifyItem(id, cambios) {
	const items = getAllItems();
	const idx = items.findIndex((item) => item.id === id);
	if (idx === -1) return null;
	const actualizado = { ...items[idx], ...cambios, id };
	items[idx] = actualizado;
	fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));
	return actualizado;
}

export function removeItem(id) {
	const items = getAllItems();
	const restantes = items.filter((item) => item.id !== id);
	if (restantes.length === items.length) return false;
	fs.writeFileSync(DATA_PATH, JSON.stringify(restantes, null, 2));
	return true;
}
