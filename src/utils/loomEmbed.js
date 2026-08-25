// Loom share URLs look like https://www.loom.com/share/<id> (sometimes with a
// ?sid=... query string); the embed URL uses the same id under /embed/.
const LOOM_ID_REGEX = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i;

export function extractLoomId(url) {
  const match = (url || '').match(LOOM_ID_REGEX);
  return match ? match[1] : null;
}

// Renders as a clickable thumbnail card, not an <iframe> — Loom's CDN thumbnail
// already bakes in a play-button overlay, and a plain <img> can't be blocked
// by the parent Zoho Creator page's CSP the way a cross-origin iframe could.
export function buildLoomEmbedHtml(url) {
  const id = extractLoomId(url);
  if (!id) return null;

  const shareUrl = `https://www.loom.com/share/${id}`;
  const thumbnailUrl = `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.gif`;

  return `<a href="${shareUrl}" target="_blank" rel="noopener" class="loom-embed-card">`
    + `<img src="${thumbnailUrl}" alt="Loom video thumbnail" loading="lazy"></a>`;
}
