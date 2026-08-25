import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';

// highlight.js ships no grammar for Zoho's Deluge — it's close enough to
// Java/JS (keywords, C-style comments and numbers, quoted strings) that a
// small hand-written grammar reads reasonably well without pulling in a
// third-party package (none exists for it on npm).
function deluge(hljsInstance) {
  return {
    name: 'Deluge',
    case_insensitive: false,
    keywords: {
      keyword: 'if else for foreach in while do break continue return try catch throw and or not this new is',
      literal: 'true false null',
      built_in: 'info invokeurl sendmail zoho input organization thisapp task getUrl',
    },
    contains: [
      hljsInstance.QUOTE_STRING_MODE,
      hljsInstance.APOS_STRING_MODE,
      hljsInstance.C_LINE_COMMENT_MODE,
      hljsInstance.C_BLOCK_COMMENT_MODE,
      hljsInstance.C_NUMBER_MODE,
    ],
  };
}

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('deluge', deluge);

// Language choices offered by the "Insert Code" picker — value must match a
// language registered above (used as the `language-<value>` class).
export const CODE_LANGUAGES = [
  { value: 'deluge', label: 'Deluge' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'xml', label: 'HTML / XML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Builds the exact <pre><code class="language-x"> markup highlightCodeBlocks()
// (and Zoho Creator's Rich Text field) expect — see highlightCodeBlocks below.
export function buildCodeBlockHtml(code, language) {
  return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
}

// Highlights every code block found inside the given container element.
// Content comes from Zoho Creator's Rich Text field as raw HTML, so blocks
// aren't pre-tagged with a language — hljs.highlightElement auto-detects it.
// Handles both <pre><code>...</code></pre> (built by buildCodeBlockHtml above)
// and a bare <pre>...</pre> with no <code> child, which is what Quill's own
// "code block" toolbar button produces for anything typed before this feature
// existed — without this fallback those older blocks are silently skipped.
export function highlightCodeBlocks(container) {
  if (!container) return;
  container.querySelectorAll('pre').forEach((pre) => {
    const target = pre.querySelector('code') || pre;
    if (target.dataset.highlighted) return;
    hljs.highlightElement(target);
  });
}

// Adds a floating "Copy" button to every <pre> block in the container. The
// button is built with plain DOM APIs (not a Vue component) because this
// content comes from v-html — Vue never mounts anything inside it.
export function addCopyButtons(container) {
  if (!container) return;
  container.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.copy-code-btn')) return; // already added

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code-btn';
    button.innerHTML = '<span class="mdi mdi-content-copy"></span>';
    button.setAttribute('aria-label', 'Copy code');

    button.addEventListener('click', () => {
      const code = pre.querySelector('code') || pre;
      navigator.clipboard.writeText(code.textContent).then(() => {
        button.innerHTML = '<span class="mdi mdi-check"></span>';
        button.classList.add('is-copied');
        setTimeout(() => {
          button.innerHTML = '<span class="mdi mdi-content-copy"></span>';
          button.classList.remove('is-copied');
        }, 1500);
      });
    });

    pre.appendChild(button);
  });
}
