/** Searchable FAQ accordions (components/FAQ.astro). */

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9/&.+-]+/g, " ")
    .trim();

function setOpen(button: HTMLButtonElement, open: boolean) {
  const panel = document.getElementById(button.getAttribute("aria-controls") ?? "");
  button.setAttribute("aria-expanded", String(open));
  if (panel) panel.hidden = !open;
}

function initFaq(root: HTMLElement) {
  if (root.dataset.faqReady) return;
  root.dataset.faqReady = "true";

  const items = [...root.querySelectorAll<HTMLElement>("[data-faq-item]")];
  const search = root.querySelector<HTMLElement>("[data-faq-search]");
  const input = root.querySelector<HTMLInputElement>("[data-faq-input]");
  const status = root.querySelector<HTMLElement>("[data-faq-status]");
  const empty = root.querySelector<HTMLElement>("[data-faq-empty]");

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-faq-toggle]")) {
    button.addEventListener("click", () => {
      setOpen(button, button.getAttribute("aria-expanded") !== "true");
    });
  }

  if (!search || !input) return;
  search.hidden = false;

  const haystacks = items.map((item) => normalize(item.textContent ?? ""));

  input.addEventListener("input", () => {
    const terms = normalize(input.value).split(" ").filter(Boolean);
    let shown = 0;

    items.forEach((item, i) => {
      const match = terms.every((term) => haystacks[i].includes(term));
      item.hidden = !match;
      if (match) shown += 1;
    });

    if (empty) empty.hidden = shown > 0;
    if (status) {
      status.textContent = terms.length
        ? shown === 0
          ? "No questions match."
          : `${shown} ${shown === 1 ? "question matches" : "questions match"}.`
        : "";
    }
  });
}

export function initFaqs() {
  document.querySelectorAll<HTMLElement>("[data-faq]").forEach(initFaq);
}
