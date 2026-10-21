/**
 * FloatingNav behaviour: mega-menus (Enter/Space opens, Escape closes and
 * returns focus to the trigger, clicking outside or tabbing away closes) and
 * the full-screen mobile sheet (focus trapped, Escape closes).
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function initMegaMenus(nav: HTMLElement) {
  const items = [...nav.querySelectorAll<HTMLElement>("[data-mega-item]")];

  const parts = (item: HTMLElement) => ({
    trigger: item.querySelector<HTMLButtonElement>("[data-mega-trigger]")!,
    panel: item.querySelector<HTMLElement>("[data-mega]")!,
  });

  const close = (item: HTMLElement, { focusTrigger = false } = {}) => {
    const { trigger, panel } = parts(item);
    if (trigger.getAttribute("aria-expanded") !== "true") return;
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    if (focusTrigger) trigger.focus();
  };

  const open = (item: HTMLElement) => {
    items.filter((other) => other !== item).forEach((other) => close(other));
    const { trigger, panel } = parts(item);
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  };

  const openItem = () =>
    items.find((item) => parts(item).trigger.getAttribute("aria-expanded") === "true");

  for (const item of items) {
    const { trigger, panel } = parts(item);

    trigger.addEventListener("click", () => {
      if (trigger.getAttribute("aria-expanded") === "true") close(item);
      else open(item);
    });

    item.addEventListener("focusout", (event) => {
      const next = event.relatedTarget as Node | null;
      if (next && !item.contains(next)) close(item);
    });

    // Solutions: hovering or focusing an outcome shows its preview.
    const outcomes = [...panel.querySelectorAll<HTMLAnchorElement>("[data-preview]")];
    const panes = [...panel.querySelectorAll<HTMLElement>("[data-preview-pane]")];
    const show = (slug: string) => {
      outcomes.forEach((o) => o.classList.toggle("is-active", o.dataset.preview === slug));
      panes.forEach((p) => (p.hidden = p.dataset.previewPane !== slug));
    };
    for (const outcome of outcomes) {
      const slug = outcome.dataset.preview!;
      outcome.addEventListener("mouseenter", () => show(slug));
      outcome.addEventListener("focus", () => show(slug));
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const item = openItem();
    if (item) {
      event.preventDefault();
      close(item, { focusTrigger: true });
    }
  });

  document.addEventListener("click", (event) => {
    const item = openItem();
    if (item && !item.contains(event.target as Node)) close(item);
  });
}

function initSheet(root: HTMLElement) {
  const sheet = root.querySelector<HTMLDialogElement>("[data-sheet]");
  const opener = root.querySelector<HTMLButtonElement>("[data-sheet-open]");
  const closer = root.querySelector<HTMLButtonElement>("[data-sheet-close]");
  if (!sheet || !opener) return;

  const close = () => sheet.close();

  opener.addEventListener("click", () => {
    sheet.showModal();
    opener.setAttribute("aria-expanded", "true");
    closer?.focus();
  });

  closer?.addEventListener("click", close);

  sheet.addEventListener("close", () => {
    opener.setAttribute("aria-expanded", "false");
    opener.focus();
  });

  // Keep Tab and Shift+Tab inside the sheet.
  sheet.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...sheet.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Close if the viewport grows past the mobile breakpoint while open.
  const desktop = window.matchMedia("(min-width: 900px)");
  desktop.addEventListener("change", (event) => {
    if (event.matches && sheet.open) close();
  });

  // Same-page anchor links inside the sheet should close it.
  sheet.addEventListener("click", (event) => {
    const link = (event.target as HTMLElement).closest("a");
    if (link && link.hash && link.pathname === location.pathname) close();
  });
}

export function initNav() {
  const root = document.querySelector<HTMLElement>("[data-nav]");
  if (!root || root.dataset.navReady) return;
  root.dataset.navReady = "true";
  const nav = root.querySelector<HTMLElement>(".nav-pill");
  if (nav) initMegaMenus(nav);
  initSheet(root);
}
