export function notFoundHandler(req, res) {
	res.status(404).json({ error: "Ruta no encontrada" });
}

export function globalErrorHandler(err, req, res, next) {
	console.error(err.stack);
	res.status(500).json({ error: "Error interno del servidor" });
}
