export function notFound(req, res, next) {
	if (req.path.startsWith("/api")) {
		return res.status(404).json({ error: "Ruta no encontrada: " + req.method + " " + req.path });
	}
	next();
}

export function errorHandler(err, req, res, next) {
	console.error(err.stack);
	const status = err.status || 500;
	res.status(status).json({ error: err.message || "Error interno del servidor" });
}
