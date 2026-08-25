// Centralized Zoho Creator API names.
// Fill in appLinkName / reportLinkName / formLinkName with the real values
// from the "Knowledge Hub" application before deploying.
export const CREATOR_CONFIG = {
  appLinkName: 'knowledge-hub',
  reportLinkName: 'Knowledge_Articles_Report',
  formLinkName: 'Knowledge_Articles',

  fields: {
    title: 'Title',
    project: 'Project',
    tags: 'Tags',
    loomUrl: 'Loom_URL',
    githubUrl: 'GitHub_URL',
    relatedUrl: 'Related_URL',
    summary: 'Summary',
    content: 'Content',
    status: 'Status',
    knowledgeType: 'Knowledge_Type',
    // Stamped once at creation with the creator's exact login identifier
    // (see articlesService.createArticle) — used for permission checks
    // (e.g. "only the creator can delete"), since Zoho's own Added_User
    // system field format isn't reliable enough to match against a login
    // email/username (order of name parts, Customer Portal vs internal
    // users, etc. all vary). Add this as a Single Line field in Zoho
    // Creator — it can be hidden from the form layout, the app never
    // shows it, it only writes/reads it via the API.
    ownerEmail: 'Owner_Email',
  },
};

export const KNOWLEDGE_TYPE = {
  CUSTOMER: 'Customer',
  INTERNAL: 'Internal',
};

export const ARTICLE_STATUS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

// Curated so every tag written by the app matches an existing choice in the
// Tags Multi Select field in Zoho Creator. Edit freely as the catalog grows.
export const TAG_OPTIONS = [
  'CRM',
  'Deluge',
  'Creator',
  'Analytics',
  'Books',
  'Desk',
  'Flow',
  'Campaigns',
  'Projects',
  'People',
  'Integration',
  'Security',
  'API',
  'Best Practices',
  'Standards',
];
