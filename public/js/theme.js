export function obtenerTema() {
	const guardado = localStorage.getItem("tema");
	if (guardado === "oscuro" || guardado === "claro") {
		return guardado;
	}
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		return "oscuro";
	}
	return "claro";
}

export function aplicarTema(tema) {
	if (tema === "oscuro") {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
}

export function initTheme(idBoton) {
	aplicarTema(obtenerTema());
	const boton = document.getElementById(idBoton);
	if (!boton) return;
	boton.addEventListener("click", () => {
		const oscuro = document.documentElement.classList.toggle("dark");
		localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
	});
}
