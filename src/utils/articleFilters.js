// Shared matching/sorting logic for normalized Article domain objects.
// Used by articlesService (mock branch + client-side search) and by views
// that apply extra facet filters on top of an already-fetched article set.

// Zoho Creator's Added_User system field (article.author) is a compact
// username like "alexisalvarado", while the viewer's login identifier
// (authorEmail, from ZOHO.CREATOR.UTIL.getInitParams().loginUser) is an email
// like "alexis.alvarado@zenatta.com". Neither format is guaranteed, so
// compare both stripped down to just letters/digits instead of requiring an
// exact match.
function normalizeUserToken(value) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Compares a viewer's login identifier (email or username) against an
// article's Added_User author, tolerant of the format mismatch described
// above. This is a best-effort fallback only — e.g. a Customer Portal login
// email like "alvaradomalexis@gmail.com" (surname-first local part) won't
// even substring-match an Added_User of "alexisalvarado" (firstname-first).
// Prefer isOwner() below wherever an `ownerEmail` is available.
export function isSameUser(loginIdentifier, authorUsername) {
  const viewer = normalizeUserToken((loginIdentifier || '').split('@')[0]);
  const author = normalizeUserToken(authorUsername);
  if (!author || !viewer) return false;
  return author === viewer || author.includes(viewer) || viewer.includes(author);
}

// The reliable check: article.ownerEmail is stamped once at creation time
// with the creator's exact login identifier (see articlesService.createArticle),
// so this is a plain equality check, not a guess. Falls back to the fuzzy
// isSameUser() only for articles created before that field existed.
export function isOwner(loginIdentifier, article) {
  if (!loginIdentifier) return false;
  if (article.ownerEmail) {
    return article.ownerEmail.trim().toLowerCase() === loginIdentifier.trim().toLowerCase();
  }
  return isSameUser(loginIdentifier, article.author);
}

export function matchesFilters(article, filters = {}) {
  const { knowledgeType, project, status, tag, authorEmail, search } = filters;

  if (knowledgeType && article.knowledgeType !== knowledgeType) return false;
  if (project && article.project !== project) return false;
  if (status && article.status !== status) return false;
  if (tag && !article.tags.includes(tag)) return false;

  if (authorEmail && !isOwner(authorEmail, article)) return false;

  if (search) {
    const haystack = `${article.title} ${article.summary} ${article.project} ${article.tags.join(' ')}`.toLowerCase();
    if (!haystack.includes(search.toLowerCase())) return false;
  }

  return true;
}

export function sortArticles(articles, sort = 'newest') {
  const sorted = [...articles].sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime));
  return sort === 'oldest' ? sorted.reverse() : sorted;
}

export function uniqueOptions(articles, key) {
  const values = new Set();
  articles.forEach((article) => {
    if (key === 'tags') {
      (article.tags || []).forEach((tag) => values.add(tag));
    } else if (article[key]) {
      values.add(article[key]);
    }
  });
  return [...values].sort((a, b) => a.localeCompare(b));
}
