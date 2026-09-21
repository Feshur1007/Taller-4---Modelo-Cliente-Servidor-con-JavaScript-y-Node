import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import itemsRouter from "./routes/items.js";
import { notFound, errorHandler } from "./middlewares/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_PATH = path.join(__dirname, "..", "public");

const app = express();

app.use(express.json());
app.use(express.static(PUBLIC_PATH, {
	setHeaders(res, filePath) {
		if (filePath.endsWith("sw.js")) {
			res.setHeader("Cache-Control", "no-cache");
		}
	}
}));

app.use("/api/items", itemsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
