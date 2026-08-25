// vue2-editor/Quill throws "Cannot read properties of undefined (reading
// 'emit')" when HTML assigned to its v-model contains <div> elements (Quill
// only expects <p> at the block level) — documented at
// https://github.com/davidroyer/vue2-editor/issues/313. Articles can end up
// with stray <div>s if their content was ever pasted in from elsewhere
// (Word, Google Docs, etc.), so normalize before handing content to the
// editor rather than trusting every stored record to be clean.
export function sanitizeQuillHtml(html) {
  if (!html) return html;
  return html.replace(/<div[^>]*>/gi, '<p>').replace(/<\/div>/gi, '</p>');
}
