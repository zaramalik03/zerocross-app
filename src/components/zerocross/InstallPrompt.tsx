import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "zerocross:install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible || !deferred) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-hairline bg-panel p-3 shadow-lg">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
          <Download className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Install ZeroCross</p>
          <p className="text-xs text-ink-muted">
            Add to your home screen for instant access.
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await deferred.prompt();
            await deferred.userChoice;
            setVisible(false);
            setDeferred(null);
          }}
          className="rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-on-brand"
        >
          Install
        </button>
        <button
          type="button"
          aria-label="Dismiss install prompt"
          onClick={dismiss}
          className="rounded-lg p-2 text-ink-faint hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
