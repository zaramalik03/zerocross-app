/**
 * Share the chef card text. Web Share is often unavailable (desktop) or blocked
 * (embedded/iframe preview), so we always fall back to copying instead of
 * telling the user the share was cancelled.
 */
function legacyCopy(text: string): boolean {
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export async function shareCardText(
  text: string,
  title = "My ZeroCross Chef Card",
) {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      await navigator.share({ title, text });
      return "Card shared.";
    } catch (err) {
      // User dismissed the OS share sheet — don't fall through to copying.
      if (err instanceof Error && err.name === "AbortError") return null;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "Card copied to your clipboard — paste it anywhere.";
  } catch {
    if (legacyCopy(text))
      return "Card copied to your clipboard — paste it anywhere.";
    return "Couldn't copy automatically. Select the card text and copy it manually.";
  }
}
