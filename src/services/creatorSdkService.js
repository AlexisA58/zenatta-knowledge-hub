import { CREATOR_CONFIG } from '@/config/creatorConfig';

// Single point of contact with the Zoho Creator JS API (v2, ZOHO.CREATOR.* namespace).
// No other file in the app should reference `window.ZOHO` directly.

function isCreatorEnvironment() {
  return typeof window !== 'undefined'
    && !!(window.ZOHO && window.ZOHO.CREATOR && window.ZOHO.CREATOR.DATA);
}

// The Creator widget SDK v2 (static.zohocdn.com/creator/widgets/version/2.0/widgetsdk-min.js)
// exposes window.ZOHO.CREATOR.DATA directly, no init() handshake required — but the
// script loads asynchronously, so it may not exist yet on the very first tick.
function waitForSdk(timeoutMs = 2000, intervalMs = 100) {
  return new Promise((resolve) => {
    if (isCreatorEnvironment()) {
      resolve(true);
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (isCreatorEnvironment()) {
        clearInterval(timer);
        resolve(true);
      } else if (Date.now() - startedAt >= timeoutMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, intervalMs);
  });
}

// Failures are logged to the console instead of failing silently — the v2
// DATA API resolves its promise even on error, it doesn't reject.
async function callZoho(label, config, invoke) {
  try {
    const response = await invoke();
    if (response && response.code !== 3000) {
      console.error(`[ZohoCreator] ${label} failed`, config, response);
    }
    return response;
  } catch (err) {
    console.error(`[ZohoCreator] ${label} threw`, config, err);
    throw err;
  }
}

async function getInitParams() {
  return window.ZOHO.CREATOR.UTIL.getInitParams();
}

async function getRecords({ criteria, maxRecords = 1000, recordCursor, fieldConfig = 'all' } = {}) {
  const config = {
    app_name: CREATOR_CONFIG.appLinkName,
    report_name: CREATOR_CONFIG.reportLinkName,
    field_config: fieldConfig,
    max_records: maxRecords,
  };
  if (criteria) config.criteria = criteria;
  if (recordCursor) config.record_cursor = recordCursor;

  return callZoho('getRecords', config, () => window.ZOHO.CREATOR.DATA.getRecords(config));
}

async function getRecordById(id) {
  const config = {
    app_name: CREATOR_CONFIG.appLinkName,
    report_name: CREATOR_CONFIG.reportLinkName,
    id,
  };
  return callZoho('getRecordById', config, () => window.ZOHO.CREATOR.DATA.getRecordById(config));
}

async function addRecord(data) {
  const config = {
    app_name: CREATOR_CONFIG.appLinkName,
    form_name: CREATOR_CONFIG.formLinkName,
    payload: { data },
  };
  return callZoho('addRecords', config, () => window.ZOHO.CREATOR.DATA.addRecords(config));
}

async function updateRecord(id, data) {
  const config = {
    app_name: CREATOR_CONFIG.appLinkName,
    report_name: CREATOR_CONFIG.reportLinkName,
    id,
    payload: { data },
  };
  return callZoho('updateRecordById', config, () => window.ZOHO.CREATOR.DATA.updateRecordById(config));
}

async function deleteRecord(id) {
  const config = {
    app_name: CREATOR_CONFIG.appLinkName,
    report_name: CREATOR_CONFIG.reportLinkName,
    id,
  };
  return callZoho('deleteRecordById', config, () => window.ZOHO.CREATOR.DATA.deleteRecordById(config));
}

export const creatorSdkService = {
  isCreatorEnvironment,
  waitForSdk,
  getInitParams,
  getRecords,
  getRecordById,
  addRecord,
  updateRecord,
  deleteRecord,
};
