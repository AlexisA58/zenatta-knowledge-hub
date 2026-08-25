// Temporary mock data, shaped like raw Zoho Creator records (same field API
// names as CREATOR_CONFIG.fields plus the system fields ID/Added_Time/etc).
// Used only when creatorSdkService.isCreatorEnvironment() is false.

const codeSample = `<p>Use the following snippet to authenticate the request:</p>
<pre><code class="language-javascript">const response = await fetch(url, {
  headers: { Authorization: \`Zoho-oauthtoken \${token}\` }
});
return response.json();</code></pre>
<p>Remember to refresh the token before it expires.</p>`;

let nextId = 2000000000001;
function makeRecord(overrides) {
  const id = String(nextId++);
  return {
    ID: id,
    Title: '',
    Project: '',
    Tags: [],
    Loom_URL: '',
    GitHub_URL: '',
    Related_URL: '',
    Summary: '',
    Content: '',
    Status: 'Published',
    Knowledge_Type: 'Internal',
    Added_User: 'alexisalvarado',
    Added_Time: '2026-05-01 09:00:00',
    Modified_Time: '2026-06-20 14:30:00',
    ...overrides,
  };
}

export const MOCK_ARTICLES = [
  makeRecord({
    Title: 'RingCentral CRM Integration',
    Project: 'RingCentral Connector',
    Tags: ['RingCentral', 'CRM', 'Integration'],
    GitHub_URL: 'https://github.com/zenatta/ringcentral-crm',
    Related_URL: 'https://developers.ringcentral.com',
    Summary: 'How Zenatta wires RingCentral call events into Zoho CRM leads and deals.',
    Content: `<h2>Overview</h2><p>This integration listens to RingCentral webhooks and creates CRM activity records.</p>${codeSample}`,
    Knowledge_Type: 'Internal',
    Modified_Time: '2026-07-10 11:15:00',
  }),
  makeRecord({
    Title: 'CRM + Absorb Integration',
    Project: 'Absorb LMS Sync',
    Tags: ['Absorb', 'CRM', 'LMS'],
    GitHub_URL: 'https://github.com/zenatta/absorb-crm-sync',
    Summary: 'Two-way sync between Zoho CRM contacts and Absorb LMS learners.',
    Content: '<h2>Overview</h2><p>Nightly Deluge scheduler pushes enrollment changes both ways.</p>',
    Knowledge_Type: 'Internal',
    Modified_Time: '2026-07-08 16:40:00',
  }),
  makeRecord({
    Title: 'Zoho Writer Advanced Merge',
    Project: 'Document Automation',
    Tags: ['Writer', 'Merge Templates'],
    Summary: 'Advanced merge field patterns for conditional sections and nested tables in Zoho Writer.',
    Content: '<h2>Conditional sections</h2><p>Use #if merge tags to hide blocks when a field is empty.</p>',
    Knowledge_Type: 'Internal',
    Modified_Time: '2026-06-30 10:05:00',
  }),
  makeRecord({
    Title: 'Deluge Best Practices',
    Project: 'Platform Standards',
    Tags: ['Deluge', 'Best Practices', 'Standards'],
    Loom_URL: 'https://www.loom.com/share/deluge-best-practices',
    Summary: 'Naming conventions, error handling, and performance tips for Deluge scripts.',
    Content: `<h2>Naming</h2><p>Prefix custom functions with the client short code.</p>${codeSample}`,
    Knowledge_Type: 'Internal',
    Modified_Time: '2026-07-12 09:20:00',
  }),
  makeRecord({
    Title: 'Creator Deployment Guide',
    Project: 'Platform Standards',
    Tags: ['Creator', 'Deployment', 'DevOps'],
    Summary: 'Step-by-step checklist for promoting a Creator app from sandbox to production.',
    Content: '<h2>Checklist</h2><ul><li>Freeze schema changes</li><li>Run migration script</li><li>Notify client</li></ul>',
    Knowledge_Type: 'Internal',
    Modified_Time: '2026-06-15 13:50:00',
  }),
  makeRecord({
    Title: 'Catalyst Jobs',
    Project: 'Catalyst Automation',
    Tags: ['Catalyst', 'Jobs', 'Node.js'],
    GitHub_URL: 'https://github.com/zenatta/catalyst-jobs',
    Summary: 'Scheduling and monitoring background jobs with Zoho Catalyst.',
    Content: '<h2>Overview</h2><p>Catalyst Jobs run isolated Node functions on a cron schedule.</p>',
    Knowledge_Type: 'Internal',
    Modified_Time: '2026-07-05 08:10:00',
  }),
  makeRecord({
    Title: 'OAuth Guide',
    Project: 'Platform Standards',
    Tags: ['OAuth', 'Security', 'API'],
    Related_URL: 'https://www.zoho.com/accounts/protocol/oauth.html',
    Summary: 'How Zenatta generates, stores, and refreshes OAuth tokens across Zoho APIs.',
    Content: `<h2>Token lifecycle</h2><p>Access tokens expire after one hour.</p>${codeSample}`,
    Knowledge_Type: 'Internal',
    Modified_Time: '2026-07-13 17:00:00',
  }),
  makeRecord({
    Title: 'Acme Corp - Order Management Customizations',
    Project: 'Acme Corp',
    Tags: ['Acme', 'Order Management'],
    Summary: 'Custom approval flow and shipping rules built for Acme Corp on top of Zoho Inventory.',
    Content: '<h2>Approval flow</h2><p>Orders above $5,000 require manager sign-off before fulfillment.</p>',
    Knowledge_Type: 'Customer',
    Added_User: 'diegoramos',
    Modified_Time: '2026-07-11 12:00:00',
  }),
  makeRecord({
    Title: 'Northwind Traders - CRM Rollout Notes',
    Project: 'Northwind Traders',
    Tags: ['Northwind', 'CRM', 'Rollout'],
    Loom_URL: 'https://www.loom.com/share/northwind-crm-rollout',
    Summary: 'Rollout plan, data migration steps, and training notes for the Northwind CRM project.',
    Content: '<h2>Migration</h2><p>Legacy leads were imported via the bulk read API in three batches.</p>',
    Knowledge_Type: 'Customer',
    Status: 'Draft',
    Added_User: 'diegoramos',
    Modified_Time: '2026-07-09 15:25:00',
  }),
  makeRecord({
    Title: 'Globex Industries - Support SLA Automation',
    Project: 'Globex Industries',
    Tags: ['Globex', 'Desk', 'SLA'],
    GitHub_URL: 'https://github.com/zenatta/globex-sla-automation',
    Summary: 'Automated escalation rules built in Zoho Desk to meet Globex’s contractual SLAs.',
    Content: '<h2>Escalation tiers</h2><p>Tickets unresolved after 4 hours notify the account manager.</p>',
    Knowledge_Type: 'Customer',
    Modified_Time: '2026-06-28 09:45:00',
  }),
];
