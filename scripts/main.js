// Actor Hover Notes: всплывающие заметки GURPS при наведении на актёра в боковой панели «Актёры».
// Заметки берутся из actor.system.notes (все записи, включая вложенные).
// Подсказку видит мастер и те, у кого есть права «Наблюдатель» и выше на актёра.

const TOOLTIP_CLASS = "ahn-tooltip";
const HOVER_DELAY_MS = 400;

function escapeHTML(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(text).replace(/[&<>"']/g, c => map[c]);
}

// Собирает текст всех заметок, включая вложенные (contains / collapsed)
function collectNotes(obj, out = []) {
  for (const entry of Object.values(obj ?? {})) {
    if (!entry || typeof entry !== "object") continue;
    if (typeof entry.notes === "string" && entry.notes.trim()) out.push(entry.notes.trim());
    collectNotes(entry.contains, out);
    collectNotes(entry.collapsed, out);
  }
  return out;
}

// Если заметка уже в HTML — оставляем как есть, иначе экранируем и переносим строки
function toHTML(text) {
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  return escapeHTML(text).replace(/\n/g, "<br>");
}

// Текст подсказки собирается в момент наведения, поэтому всегда актуален
function buildContent(actor) {
  const notes = collectNotes(actor.system?.notes);
  if (!notes.length) return null;
  return `<strong>${escapeHTML(actor.name)}</strong><hr>` + notes.map(toHTML).join("<hr>");
}

Hooks.on("renderActorDirectory", (app, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;

  for (const li of root.querySelectorAll("[data-entry-id], [data-document-id]")) {
    if (li.dataset.ahnBound) continue;
    li.dataset.ahnBound = "1";

    let timer = null;

    li.addEventListener("pointerenter", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const actor = game.actors.get(li.dataset.entryId ?? li.dataset.documentId);
        if (!actor || !actor.testUserPermission(game.user, "OBSERVER")) return;
        const content = buildContent(actor);
        if (!content) return;
        game.tooltip.activate(li, { html: content, cssClass: TOOLTIP_CLASS, direction: "LEFT" });
      }, HOVER_DELAY_MS);
    });

    li.addEventListener("pointerleave", () => {
      clearTimeout(timer);
      if (game.tooltip.element === li) game.tooltip.deactivate();
    });
  }
});
