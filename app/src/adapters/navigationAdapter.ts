export type BackHandler = () => boolean;

export function registerBackHandler(handler: BackHandler): () => void {
  if (typeof window === "undefined") {
    return noop;
  }

  function onPopState() {
    handler();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape") {
      return;
    }

    if (handler()) {
      event.preventDefault();
    }
  }

  window.addEventListener("popstate", onPopState);
  window.addEventListener("keydown", onKeyDown);

  return () => {
    window.removeEventListener("popstate", onPopState);
    window.removeEventListener("keydown", onKeyDown);
  };
}

function noop() {}
