if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	});
}

const installBtn = document.getElementById("installBtn");
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
	e.preventDefault();
	deferredPrompt = e;
	if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
	installBtn.addEventListener("click", () => {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then(() => {
			deferredPrompt = null;
			installBtn.hidden = true;
		}).catch(() => {});
	});
}

window.addEventListener("appinstalled", () => {
	if (installBtn) installBtn.hidden = true;
});

const offlineBadge = document.getElementById("offlineBadge");

function updateOnlineStatus() {
	if (offlineBadge) offlineBadge.hidden = navigator.onLine;
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();
