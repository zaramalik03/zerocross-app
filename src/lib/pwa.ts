const SW_URL = "/sw.js";

function isBlockedContext(): boolean {
  if (typeof window === "undefined") return true;
  if (!import.meta.env.PROD) return true;

  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }

  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--"))
    return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com"))
    return true;
  if (
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com")
  )
    return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev"))
    return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off")
    return true;

  return false;
}

async function unregisterAppServiceWorkers() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator))
    return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) => {
        const script =
          registration.active?.scriptURL ??
          registration.installing?.scriptURL ??
          "";
        return script.endsWith(SW_URL);
      })
      .map((registration) => registration.unregister()),
  );
}

export async function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator))
    return;

  if (isBlockedContext()) {
    await unregisterAppServiceWorkers();
    return;
  }

  try {
    await navigator.serviceWorker.register(SW_URL, { scope: "/" });
  } catch {
    // Offline support is best-effort; the app works without it.
  }
}
