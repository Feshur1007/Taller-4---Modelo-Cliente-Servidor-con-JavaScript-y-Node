import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Router } from "express";
import { validateItem } from "../middlewares/validate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "..", "data", "items.json");

const router = Router();

function readData() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
    const q = req.query.q;
    const categoria = req.query.categoria;
    const sort = req.query.sort;
    let resultados = readData();

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
    const id = parseInt(req.params.id);
    const item = readData().find(i => i.id === id);
    if (!item) {
        return res.status(404).json({ error: "No encontrado" });
    }
    res.json(item);
});

router.post("/", validateItem, (req, res) => {
    const items = readData();
    const nuevo = req.body;
    nuevo.id = Date.now();
    items.push(nuevo);
    writeData(items);
    res.status(201).json(nuevo);
});

router.put("/:id", validateItem, (req, res) => {
    const id = parseInt(req.params.id);
    let items = readData();
    const idx = items.findIndex(i => i.id === id);

    if (idx >= 0) {
        const updated = { ...items[idx], ...req.body, id };
        items[idx] = updated;
        writeData(items);
        res.json(updated);
    } else {
        res.status(404).json({ error: "No encontrado" });
    }
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let items = readData();
    const newItems = items.filter(i => i.id !== id);

    if (newItems.length !== items.length) {
        writeData(newItems);
        res.json({ mensaje: "Eliminado" });
    } else {
        res.status(404).json({ error: "No fue encontrado" });
    }
});

export default router;
