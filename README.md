# Zenatta Knowledge Hub

Internal knowledge base widget for Zoho Creator. It lets the Zenatta team browse, search, and maintain technical documentation, i.e. client integrations, internal standards, deployment guides, Deluge snippets, and Loom recordings, without leaving Zoho Creator.

Data is stored in a Zoho Creator form/report (`Knowledge_Articles_Report` / `Knowledge_Articles`) and read/written through the Creator JS API v2 (`ZOHO.CREATOR.DATA.*`, see `src/services/creatorSdkService.js`). When the app isn't running inside Zoho Creator (e.g. `npm run serve` in a plain browser tab), it falls back to local mock data (`src/services/mockData.js`) so the UI can still be developed and previewed on its own.

## What it's for / how it's used

- **Home** — search across all articles, and quick links into the Customers/Internal sections.
- **Customers** / **Internal** — browse articles by knowledge type, with filters (Project, Status, Tags) and sorting.
- **Recently Updated** / **My Articles** — the most recently modified articles, and the ones the current logged-in user created.
- **New Article / Edit** — a full-page, Notion-style editor: title, collapsible property panel (Project, Knowledge Type, Status, Tags, Summary, Loom/GitHub/Related URLs), and a rich-text Content editor with buttons to insert syntax-highlighted code blocks (JavaScript, Deluge, HTML, CSS, JSON, Bash, SQL) and Loom video thumbnails.
- **Delete** — only shown to the article's own creator (compared via the `Owner_Email` field stamped at creation time), not shown to anyone else.
- Tags are managed from a curated list (`TAG_OPTIONS` in `src/config/creatorConfig.js`) plus a free-text "Add a new tag" input; the Tags field in Zoho Creator must accept whatever values get typed there (see Configuration below).

## Project setup

```
npm install
```

### Compile and hot-reload for local development

```
npm run serve
```

Runs against mock data unless the page is actually loaded inside a Zoho Creator widget context (see `creatorSdkService.isCreatorEnvironment()`).

### Compile and minify for production

```
npm run build
```

Builds into the `app/` folder (see `outputDir` in `vue.config.js` — **not** the default `dist/`, that folder is used by `zet pack` below instead).

## Deploying the widget to Zoho Creator

1. Build the app:
   ```
   npm run build
   ```
   This regenerates the `app/` folder with the latest HTML/CSS/JS.

2. Pack it into an installable widget/extension archive:
   ```
   zet pack
   ```
   This zips the project (per `plugin-manifest.json`) into **`dist/knowledge_hub.zip`** — that zip is what you upload as the Widget in Zoho Creator. `zet pack` will print a warning about a few disallowed file formats (`favicon.ico`, `*.js.map` source maps) — that's expected and non-fatal, the zip is still produced correctly without them.

3. Upload `dist/knowledge_hub.zip` in Zoho Creator's widget settings.

`zet` is the [Zoho Extension Toolkit CLI](https://www.npmjs.com/package/zoho-extension-toolkit) (`npm install -g zoho-extension-toolkit`); it needs `zet login` once per machine before `zet pack`/`zet push` will work.

## Configuration

`src/config/creatorConfig.js` centralizes everything that has to match the real Zoho Creator app:

- `appLinkName` / `reportLinkName` / `formLinkName` — the Creator app/report/form link names.
- `fields` — the API name of every field on the `Knowledge_Articles` form.
- `TAG_OPTIONS` — the tag choices shown as chips in the editor (keep in sync with the Tags field's configuration in Zoho Creator).

### Customize build configuration

See the [Vue CLI Configuration Reference](https://cli.vuejs.org/config/).
