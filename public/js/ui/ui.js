function escapeHtml(value) {
	return String(value ?? "").replace(/[&<>"']/g, (char) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;"
	}[char]));
}

export function renderItems(items, tableBody) {
	tableBody.innerHTML = "";
	items.forEach(item => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${item.id}</td>
			<td>${escapeHtml(item.name)}</td>
			<td>${escapeHtml(item.description) || ""}</td>
			<td>${item.price}</td>
			<td>${escapeHtml(item.category) || ""}</td>
			<td>${item.cantidad}</td>
			<td>${item.fecha || ""}</td>
			<td>
				<button class="btn-edit" data-id="${item.id}">Editar</button>
				<button class="btn-delete" data-id="${item.id}">Eliminar</button>
			</td>
		`;
		tableBody.appendChild(row);
	});
}

export function resetForm(form, submitBtn, cancelBtn) {
	form.reset();
	if (submitBtn) submitBtn.textContent = "Agregar";
	if (cancelBtn) cancelBtn.hidden = true;
}

export function fillForm(form, item, submitBtn, cancelBtn) {
	form.querySelector("#name").value = item.name;
	form.querySelector("#description").value = item.description || "";
	form.querySelector("#price").value = item.price;
	form.querySelector("#category").value = item.category || "";
	form.querySelector("#cantidad").value = item.cantidad;
	form.querySelector("#fecha").value = item.fecha || "";
	if (submitBtn) submitBtn.textContent = "Guardar cambios";
	if (cancelBtn) cancelBtn.hidden = false;
}

export function renderCatalog(items, container) {
	container.innerHTML = "";
	items.forEach(item => {
		const card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `
			<h3>${escapeHtml(item.name)}</h3>
			<p><span class="badge">${escapeHtml(item.category) || ""}</span></p>
			<p class="price">$${item.price}</p>
			<p class="cantidad">Cantidad: ${item.cantidad}</p>
			<p class="fecha">${item.fecha || ""}</p>
			<button class="btn" data-id="${item.id}">Ver detalle</button>
		`;
		container.appendChild(card);
	});
}

export function showCatalogLoading(container) {
	container.innerHTML = `
		<div class="card skeleton"></div>
		<div class="card skeleton"></div>
		<div class="card skeleton"></div>
		<div class="card skeleton"></div>
	`;
}

export function showCatalogEmpty(container, buscando) {
	if (buscando) {
		container.innerHTML = "<p>No hay resultados para tu búsqueda.</p>";
	} else {
		container.innerHTML = "<p>No hay libros en el catálogo.</p>";
	}
}

export function showCatalogError(container) {
	container.innerHTML = "<p>No se pudo cargar el catálogo. Revisa tu conexión e intenta de nuevo.</p>";
}

export function showItemModal(modal, modalBody, item) {
	modalBody.innerHTML = `
		<h2>${escapeHtml(item.name)}</h2>
		<p><span class="badge">${escapeHtml(item.category) || ""}</span></p>
		<p><strong>Precio:</strong> $${item.price}</p>
		<p><strong>Cantidad:</strong> ${item.cantidad}</p>
		<p><strong>Fecha:</strong> ${item.fecha || ""}</p>
		<p>${escapeHtml(item.description) || ""}</p>
	`;
	modal.style.display = "flex";
}

export function hideItemModal(modal) {
	modal.style.display = "none";
}

export function showToast(message, type) {
	const toast = document.createElement("div");
	toast.textContent = message;
	toast.style.position = "fixed";
	toast.style.bottom = "20px";
	toast.style.left = "50%";
	toast.style.transform = "translateX(-50%)";
	toast.style.padding = "10px 16px";
	toast.style.borderRadius = "8px";
	toast.style.color = "white";
	toast.style.background = type === "success" ? "#047857" : "#b91c1c";
	toast.style.zIndex = "100";
	document.body.appendChild(toast);
	setTimeout(() => toast.remove(), 2500);
}
