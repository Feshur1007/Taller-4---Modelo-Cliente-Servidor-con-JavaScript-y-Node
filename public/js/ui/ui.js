export function renderItems(items, tableBody) {
	tableBody.innerHTML = "";
	items.forEach(item => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${item.id}</td>
			<td>${item.name}</td>
			<td>${item.description || ""}</td>
			<td>${item.price}</td>
			<td>${item.category || ""}</td>
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

export function resetForm(form, submitBtn) {
	form.reset();
	if (submitBtn) submitBtn.textContent = "Agregar";
}

export function fillForm(form, item, submitBtn) {
	form.querySelector("#name").value = item.name;
	form.querySelector("#description").value = item.description || "";
	form.querySelector("#price").value = item.price;
	form.querySelector("#category").value = item.category || "";
	form.querySelector("#cantidad").value = item.cantidad;
	form.querySelector("#fecha").value = item.fecha || "";
	if (submitBtn) submitBtn.textContent = "Guardar cambios";
}

export function renderCatalog(items, container) {
	container.innerHTML = "";
	items.forEach(item => {
		const card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `
			<h3>${item.name}</h3>
			<p><span class="badge">${item.category || ""}</span></p>
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
		<h2>${item.name}</h2>
		<p><span class="badge">${item.category || ""}</span></p>
		<p><strong>Precio:</strong> $${item.price}</p>
		<p><strong>Cantidad:</strong> ${item.cantidad}</p>
		<p><strong>Fecha:</strong> ${item.fecha || ""}</p>
		<p>${item.description || ""}</p>
	`;
	modal.style.display = "flex";
}

export function hideItemModal(modal) {
	modal.style.display = "none";
}
