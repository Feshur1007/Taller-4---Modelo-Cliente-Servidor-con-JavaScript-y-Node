import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import itemsRoutes from "./routes/items.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api/items", itemsRoutes);
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
