import { CREATOR_CONFIG } from '@/config/creatorConfig';
import { creatorSdkService } from '@/services/creatorSdkService';
import { MOCK_ARTICLES } from '@/services/mockData';
import { matchesFilters, sortArticles } from '@/utils/articleFilters';
import { useAuth } from '@/composables/useAuth';

const { fields } = CREATOR_CONFIG;

// In-memory copy so Create/Edit feel real during local development without a backend.
let mockDb = MOCK_ARTICLES.map((record) => ({ ...record }));

// Only memoize a confirmed `true`. If the SDK handshake hasn't finished yet
// (slow network, widget opened right at page load), waitForSdk() can return
// `false` even though window.ZOHO.CREATOR shows up moments later — caching
// that `false` would silently strand the rest of the session on mock data.
let usingCreator = false;
async function ensureEnvironmentChecked() {
  if (!usingCreator) {
    usingCreator = await creatorSdkService.waitForSdk();
  }
  return usingCreator;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map((tag) => tag.trim());
  return [];
}

// Zoho Creator's URL field type stores { value, url, title }, not a plain
// string — but mock data (and any record created before this fix) still uses
// plain strings, so accept both shapes when reading.
function fromUrlField(value) {
  if (!value) return '';
  if (typeof value === 'object') return value.url || value.value || '';
  return value;
}

// Wrap a plain string back into the { value, url, title } shape Zoho's URL
// field expects on write. Leave it as an empty string when unset — Zoho
// accepts that for an optional field.
function toUrlField(value) {
  if (!value) return '';
  return { value, url: value, title: value };
}

function normalizeRecord(raw) {
  // Zoho Creator's real system field is `Added_User` (a plain username string,
  // e.g. "alexisalvarado") — mock data still uses the older { zc_display_value,
  // email } object shape, so accept both.
  const author = raw.Added_User;
  return {
    id: raw.ID,
    title: raw[fields.title] || '',
    project: raw[fields.project] || '',
    tags: toArray(raw[fields.tags]),
    loomUrl: fromUrlField(raw[fields.loomUrl]),
    githubUrl: fromUrlField(raw[fields.githubUrl]),
    relatedUrl: fromUrlField(raw[fields.relatedUrl]),
    summary: raw[fields.summary] || '',
    content: raw[fields.content] || '',
    status: raw[fields.status] || '',
    knowledgeType: raw[fields.knowledgeType] || '',
    author: typeof author === 'object' && author ? (author.zc_display_value || author.email || '') : (author || ''),
    authorEmail: typeof author === 'object' && author ? (author.email || '') : '',
    // Stamped once at creation (see createArticle) with the creator's exact
    // login identifier — the reliable field for "is this my article?" checks.
    // Blank on articles created before this field existed.
    ownerEmail: raw[fields.ownerEmail] || '',
    createdTime: raw.Added_Time || '',
    modifiedTime: raw.Modified_Time || '',
  };
}

function denormalizeForWrite(article) {
  const data = {
    [fields.title]: article.title,
    [fields.project]: article.project,
    [fields.summary]: article.summary || '',
    [fields.content]: article.content || '',
    [fields.status]: article.status,
    [fields.knowledgeType]: article.knowledgeType,
  };

  // Zoho rejects an explicit "empty" value for these field types (`[]` for
  // Multi Select, `""` for URL) — the key must be left out entirely instead.
  // Multi Select values must be a comma-separated string, not a JSON array
  // (per Zoho's "Setting Field Values" reference) — sending an array is what
  // was causing "Invalid column value for Tags".
  if (article.tags && article.tags.length) data[fields.tags] = article.tags.join(',');
  if (article.loomUrl) data[fields.loomUrl] = toUrlField(article.loomUrl);
  if (article.githubUrl) data[fields.githubUrl] = toUrlField(article.githubUrl);
  if (article.relatedUrl) data[fields.relatedUrl] = toUrlField(article.relatedUrl);

  return data;
}

// `authorEmail` (really: the viewer's login identifier) is deliberately not
// part of this criteria — Zoho's Added_User system field stores a compact
// username (e.g. "alexisalvarado"), not the login email, and the two can't be
// compared with a plain "==" on the server. See matchesFilters() for the
// client-side fuzzy match applied instead.
function buildCriteria({ knowledgeType, project, status, tag } = {}) {
  const parts = [];
  if (knowledgeType) parts.push(`${fields.knowledgeType} == "${knowledgeType}"`);
  if (project) parts.push(`${fields.project} == "${project}"`);
  if (status) parts.push(`${fields.status} == "${status}"`);
  if (tag) parts.push(`${fields.tags}.contains("${tag}")`);
  return parts.length ? parts.join(' && ') : '';
}

// Zoho Creator's v2 DATA API resolves its promise even on failure (wrong field
// API name, permission error, etc.) — only `response.code === 3000` means success.
// Without this check a failed write looks identical to a successful one.
function assertSuccess(response) {
  if (!response || response.code !== 3000) {
    const message = (response && response.message) || 'Zoho Creator request failed.';
    throw new Error(message);
  }
  return response;
}

// filters: { knowledgeType, project, status, tag, authorEmail, search, sort: 'newest' | 'oldest' }
async function listArticles(filters = {}) {
  const inCreator = await ensureEnvironmentChecked();

  let articles;
  if (inCreator) {
    const { search, authorEmail, sort, ...criteriaFilters } = filters;
    const criteria = buildCriteria(criteriaFilters);
    const response = assertSuccess(await creatorSdkService.getRecords({ criteria: criteria || undefined }));
    articles = (response.data || []).map(normalizeRecord);
    if (search || authorEmail) articles = articles.filter((article) => matchesFilters(article, { search, authorEmail }));
  } else {
    articles = mockDb.map(normalizeRecord).filter((article) => matchesFilters(article, filters));
  }

  return sortArticles(articles, filters.sort);
}

async function getArticleById(id) {
  const inCreator = await ensureEnvironmentChecked();

  if (inCreator) {
    const response = assertSuccess(await creatorSdkService.getRecordById(id));
    return normalizeRecord(response.data);
  }

  const raw = mockDb.find((record) => record.ID === id);
  if (!raw) throw new Error(`Article ${id} not found`);
  return normalizeRecord(raw);
}

async function createArticle(article) {
  const inCreator = await ensureEnvironmentChecked();

  const { state: authState, init } = useAuth();
  await init();
  const payload = { ...denormalizeForWrite(article), [fields.ownerEmail]: authState.email || '' };

  if (inCreator) {
    const response = assertSuccess(await creatorSdkService.addRecord(payload));
    return getArticleById(response.data.ID);
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const newRecord = {
    ID: String(Date.now()),
    Added_User: 'alexisalvarado',
    Added_Time: now,
    Modified_Time: now,
    ...payload,
  };
  mockDb = [newRecord, ...mockDb];
  return normalizeRecord(newRecord);
}

async function updateArticle(id, article) {
  const inCreator = await ensureEnvironmentChecked();
  const payload = denormalizeForWrite(article);

  if (inCreator) {
    assertSuccess(await creatorSdkService.updateRecord(id, payload));
    return getArticleById(id);
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  mockDb = mockDb.map((record) => (
    record.ID === id ? { ...record, ...payload, Modified_Time: now } : record
  ));
  return getArticleById(id);
}

async function deleteArticle(id) {
  const inCreator = await ensureEnvironmentChecked();

  if (inCreator) {
    assertSuccess(await creatorSdkService.deleteRecord(id));
    return;
  }

  mockDb = mockDb.filter((record) => record.ID !== id);
}

export const articlesService = {
  listArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
