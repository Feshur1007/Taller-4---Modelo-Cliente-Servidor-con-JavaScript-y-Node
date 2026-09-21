import { Router } from "express";
import { getAllItems, findItem, insertItem, modifyItem, removeItem } from "../db/db.js";
import { validateItem } from "../middlewares/validate.js";

const router = Router();

router.param("id", (req, res, next, value) => {
	const id = Number(value);
	if (!Number.isInteger(id)) {
		return res.status(400).json({ error: "El id debe ser un número entero" });
	}
	req.itemId = id;
	next();
});

router.get("/", (req, res) => {
	const q = req.query.q;
	const categoria = req.query.categoria;
	const sort = req.query.sort;
	let resultados = getAllItems();

	if (q) {
		const texto = q.toLowerCase();
		resultados = resultados.filter(item =>
			item.name.toLowerCase().includes(texto) ||
			(item.description || "").toLowerCase().includes(texto)
		);
	}

	if (categoria) {
		resultados = resultados.filter(item =>
			item.category.toLowerCase() === categoria.toLowerCase()
		);
	}

	if (sort === "precio") {
		resultados = resultados.slice().sort((a, b) => a.price - b.price);
	}

	res.json(resultados);
});

router.get("/:id", (req, res) => {
	const item = findItem(req.itemId);
	if (!item) {
		return res.status(404).json({ error: "No encontrado" });
	}
	res.json(item);
});

router.post("/", validateItem, (req, res) => {
	const nuevo = insertItem({
		name: req.body.name.trim(),
		description: req.body.description || "",
		price: req.body.price,
		category: req.body.category,
		cantidad: req.body.cantidad !== undefined ? Number(req.body.cantidad) : 0,
		fecha: req.body.fecha || ""
	});
	res.status(201).json(nuevo);
});

router.put("/:id", validateItem, (req, res) => {
	const actualizado = modifyItem(req.itemId, {
		name: req.body.name.trim(),
		description: req.body.description || "",
		price: req.body.price,
		category: req.body.category,
		cantidad: req.body.cantidad !== undefined ? Number(req.body.cantidad) : 0,
		fecha: req.body.fecha || ""
	});
	if (!actualizado) {
		return res.status(404).json({ error: "No encontrado" });
	}
	res.json(actualizado);
});

router.delete("/:id", (req, res) => {
	const eliminado = removeItem(req.itemId);
	if (!eliminado) {
		return res.status(404).json({ error: "No fue encontrado" });
	}
	res.json({ mensaje: "Eliminado", id: req.itemId });
});

export default router;
