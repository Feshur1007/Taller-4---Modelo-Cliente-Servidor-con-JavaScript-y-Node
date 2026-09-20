export function validateItem(req, res, next) {
	const body = req.body || {};
	const errors = [];
	const categorias = ["novela", "infantil", "thriller", "ciencia ficción", "desarrollo personal", "historia"];

	if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
		errors.push("El nombre es obligatorio");
	}

	const rawPrecio = body.price !== undefined ? body.price : body.precio;
	if (rawPrecio === undefined || rawPrecio === null || rawPrecio === "") {
		errors.push("El precio es obligatorio");
	} else {
		const precio = Number(rawPrecio);
		if (isNaN(precio)) {
			errors.push("El precio debe ser un numero");
		} else if (precio < 0) {
			errors.push("El precio debe ser mayor o igual a 0");
		} else {
			req.body.price = precio;
		}
	}

	const rawCategoria = body.category !== undefined ? body.category : body.categoria;
	if (!rawCategoria || typeof rawCategoria !== "string" || rawCategoria.trim() === "") {
		errors.push("La categoria es obligatoria");
	} else if (!categorias.includes(rawCategoria.trim().toLowerCase())) {
		errors.push("Categoria invalida. Valores permitidos: " + categorias.join(", "));
	} else {
		req.body.category = rawCategoria.trim();
	}

	if (errors.length > 0) {
		return res.status(400).json({ errors: errors });
	}

	next();
}
