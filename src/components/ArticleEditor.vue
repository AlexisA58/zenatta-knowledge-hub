<template>
  <div v-if="editor.isOpen" class="editor-page">
    <header class="editor-topbar">
      <button class="btn btn-ghost btn-sm" @click="handleClose">
        <span class="mdi mdi-close" />
        Close
      </button>
      <div class="editor-topbar-actions">
        <button type="button" class="btn btn-secondary btn-sm" @click="handleClose">Cancel</button>
        <button type="submit" form="article-form" class="btn btn-primary btn-sm" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Article' }}
        </button>
      </div>
    </header>

    <div class="editor-body">
      <LoadingState v-if="loadingArticle" message="Loading article..." />

      <form v-else id="article-form" class="editor-form" @submit.prevent="submit">
        <div class="page-icon">
          <span class="mdi mdi-file-document-outline" />
        </div>

        <input
          v-model="form.title"
          type="text"
          class="title-input"
          :class="{ 'has-error': errors.title }"
          placeholder="Untitled"
        >
        <span v-if="errors.title" class="field-error">{{ errors.title }}</span>

        <button type="button" class="view-details-toggle" @click="showDetails = !showDetails">
          {{ showDetails ? 'Hide details' : 'View details' }}
        </button>

        <div v-show="showDetails" class="properties">
          <div v-if="isEdit" class="property-row">
            <div class="property-label"><span class="mdi mdi-account-circle-outline" /> Created by</div>
            <div class="property-value read-only">
              <span class="avatar-chip">{{ authorInitials }}</span>{{ form.author }}
            </div>
          </div>
          <div v-if="isEdit" class="property-row">
            <div class="property-label"><span class="mdi mdi-calendar-outline" /> Created</div>
            <div class="property-value read-only">{{ createdLabel }}</div>
          </div>

          <div class="property-row">
            <div class="property-label"><span class="mdi mdi-book-outline" /> Knowledge Type *</div>
            <div class="property-value">
              <select v-model="form.knowledgeType" class="prop-select" :class="{ 'has-error': errors.knowledgeType }">
                <option value="">Select...</option>
                <option value="Customer">Customer</option>
                <option value="Internal">Internal</option>
              </select>
              <span v-if="errors.knowledgeType" class="field-error">{{ errors.knowledgeType }}</span>
            </div>
          </div>
          <div v-if="form.knowledgeType !== 'Internal'" class="property-row">
            <div class="property-label"><span class="mdi mdi-folder-outline" /> Project</div>
            <div class="property-value">
              <input v-model="form.project" type="text" class="prop-input" placeholder="Empty">
            </div>
          </div>
          <div class="property-row">
            <div class="property-label"><span class="mdi mdi-flag-outline" /> Status *</div>
            <div class="property-value">
              <select v-model="form.status" class="prop-select" :class="{ 'has-error': errors.status }">
                <option value="">Select...</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
              <span v-if="errors.status" class="field-error">{{ errors.status }}</span>
            </div>
          </div>
          <div class="property-row">
            <div class="property-label"><span class="mdi mdi-label-outline" /> Tags</div>
            <div class="property-value">
              <div class="tag-options">
                <button
                  v-for="tag in tagOptions"
                  :key="tag"
                  type="button"
                  class="tag-chip"
                  :class="{ 'is-selected': form.tags.includes(tag) }"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </button>
                <button
                  v-for="tag in customTags"
                  :key="`custom-${tag}`"
                  type="button"
                  class="tag-chip is-selected"
                  title="Remove tag"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                  <span class="mdi mdi-close" />
                </button>
              </div>
              <div class="tag-add-row">
                <input
                  v-model="newTagInput"
                  type="text"
                  class="prop-input"
                  placeholder="Add a new tag..."
                  @keydown.enter.prevent="addCustomTag"
                >
                <button type="button" class="btn btn-secondary btn-sm" :disabled="!newTagInput.trim()" @click="addCustomTag">
                  Add
                </button>
              </div>
            </div>
          </div>
          <div class="property-row">
            <div class="property-label"><span class="mdi mdi-text-long" /> Summary</div>
            <div class="property-value">
              <textarea v-model="form.summary" class="prop-textarea" rows="2" placeholder="Empty" />
            </div>
          </div>
          <div class="property-row">
            <div class="property-label"><span class="mdi mdi-play-circle-outline" /> Loom URL</div>
            <div class="property-value">
              <input v-model="form.loomUrl" type="url" class="prop-input" placeholder="https://www.loom.com/share/...">
            </div>
          </div>
          <div class="property-row">
            <div class="property-label"><span class="mdi mdi-github" /> GitHub URL</div>
            <div class="property-value">
              <input v-model="form.githubUrl" type="url" class="prop-input" placeholder="https://github.com/...">
            </div>
          </div>
          <div class="property-row">
            <div class="property-label"><span class="mdi mdi-link-variant" /> Related URL</div>
            <div class="property-value">
              <input v-model="form.relatedUrl" type="url" class="prop-input" placeholder="Empty">
            </div>
          </div>
        </div>

        <hr class="divider">

        <div class="content-toolbar">
          <button type="button" class="btn btn-secondary btn-sm" @click="showCodePanel = !showCodePanel">
            <span class="mdi mdi-code-tags" />
            Insert Code
          </button>
          <button type="button" class="btn btn-secondary btn-sm" @click="showLoomPanel = !showLoomPanel">
            <span class="mdi mdi-play-circle-outline" />
            Insert Loom Video
          </button>
        </div>

        <div v-if="showCodePanel" class="code-panel">
          <div class="code-panel-row">
            <label>Language</label>
            <select v-model="codeLanguage" class="select">
              <option v-for="lang in codeLanguages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
          </div>
          <textarea
            v-model="codeInput"
            class="textarea code-input"
            rows="6"
            placeholder="Paste your code here..."
          />
          <div class="code-panel-actions">
            <button type="button" class="btn btn-secondary btn-sm" @click="cancelCodeInsert">Cancel</button>
            <button type="button" class="btn btn-primary btn-sm" :disabled="!codeInput.trim()" @click="insertCodeBlock">
              Insert
            </button>
          </div>
        </div>

        <div v-if="showLoomPanel" class="code-panel">
          <div class="code-panel-row">
            <label>Loom URL</label>
            <input
              v-model="loomInput"
              type="url"
              class="input"
              placeholder="https://www.loom.com/share/..."
              @keydown.enter.prevent="insertLoomEmbed"
            >
          </div>
          <p v-if="loomError" class="field-error">{{ loomError }}</p>
          <div class="code-panel-actions">
            <button type="button" class="btn btn-secondary btn-sm" @click="cancelLoomInsert">Cancel</button>
            <button type="button" class="btn btn-primary btn-sm" :disabled="!loomInput.trim()" @click="insertLoomEmbed">
              Insert
            </button>
          </div>
        </div>

        <div class="field content-field">
          <VueEditor ref="quillEditor" v-model="form.content" :editor-toolbar="toolbar" />
        </div>

        <p v-if="errorMessage" class="banner banner-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="banner banner-success">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor';
import { useArticleEditor } from '@/composables/useArticleEditor';
import { articlesService } from '@/services/articlesService';
import LoadingState from '@/components/LoadingState.vue';
import { formatDate } from '@/utils/formatDate';
import { TAG_OPTIONS } from '@/config/creatorConfig';
import { CODE_LANGUAGES, buildCodeBlockHtml } from '@/utils/highlightCode';
import { buildLoomEmbedHtml } from '@/utils/loomEmbed';
import { sanitizeQuillHtml } from '@/utils/sanitizeQuillHtml';

const EMPTY_FORM = () => ({
  title: '',
  project: '',
  knowledgeType: '',
  status: '',
  tags: [],
  summary: '',
  content: '',
  loomUrl: '',
  githubUrl: '',
  relatedUrl: '',
});

export default {
  name: 'ArticleEditor',
  components: { VueEditor, LoadingState },
  data() {
    const { state } = useArticleEditor();
    return {
      editor: state,
      form: EMPTY_FORM(),
      tagOptions: TAG_OPTIONS,
      newTagInput: '',
      errors: {},
      showDetails: true,
      loadingArticle: false,
      saving: false,
      errorMessage: '',
      successMessage: '',
      showCodePanel: false,
      codeLanguage: 'deluge',
      codeInput: '',
      codeLanguages: CODE_LANGUAGES,
      showLoomPanel: false,
      loomInput: '',
      loomError: '',
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
      ],
    };
  },
  computed: {
    isEdit() {
      return this.editor.mode === 'edit';
    },
    authorInitials() {
      const name = this.form.author || '';
      return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
    },
    createdLabel() {
      return formatDate(this.form.createdTime) || '';
    },
    // Tags picked/typed that aren't in the curated tagOptions list — shown as
    // their own removable chips so anything already on the article stays visible.
    customTags() {
      return this.form.tags.filter((tag) => !this.tagOptions.includes(tag));
    },
  },
  watch: {
    'editor.isOpen': function onOpenChange(isOpen) {
      if (isOpen) this.load();
    },
  },
  methods: {
    async load() {
      this.errors = {};
      this.errorMessage = '';
      this.successMessage = '';
      this.showDetails = true;
      this.showCodePanel = false;
      this.codeInput = '';
      this.showLoomPanel = false;
      this.loomInput = '';
      this.loomError = '';

      if (this.isEdit && this.editor.articleId) {
        this.loadingArticle = true;
        try {
          const article = await articlesService.getArticleById(this.editor.articleId);
          this.form = { ...EMPTY_FORM(), ...article, content: sanitizeQuillHtml(article.content) };
        } catch (err) {
          this.errorMessage = err.message || 'Could not load this article.';
        } finally {
          this.loadingArticle = false;
        }
      } else {
        this.form = EMPTY_FORM();
      }
    },
    toggleTag(tag) {
      const index = this.form.tags.indexOf(tag);
      if (index === -1) {
        this.form.tags.push(tag);
      } else {
        this.form.tags.splice(index, 1);
      }
    },
    addCustomTag() {
      const tag = this.newTagInput.trim();
      if (tag && !this.form.tags.includes(tag)) {
        this.form.tags.push(tag);
      }
      this.newTagInput = '';
    },
    insertHtmlAtCursor(html) {
      const quill = this.$refs.quillEditor && this.$refs.quillEditor.quill;
      if (quill) {
        const index = quill.getSelection() ? quill.getSelection().index : quill.getLength();
        quill.clipboard.dangerouslyPasteHTML(index, html);
      } else {
        // Fallback if the Quill instance isn't available yet: append to the end.
        this.form.content += html;
      }
    },
    insertCodeBlock() {
      const code = this.codeInput.trim();
      if (!code) return;

      this.insertHtmlAtCursor(buildCodeBlockHtml(code, this.codeLanguage));
      this.cancelCodeInsert();
    },
    cancelCodeInsert() {
      this.showCodePanel = false;
      this.codeInput = '';
      this.codeLanguage = 'deluge';
    },
    insertLoomEmbed() {
      const url = this.loomInput.trim();
      if (!url) return;

      const html = buildLoomEmbedHtml(url);
      if (!html) {
        this.loomError = "That doesn't look like a Loom share link.";
        return;
      }

      this.insertHtmlAtCursor(html);
      this.cancelLoomInsert();
    },
    cancelLoomInsert() {
      this.showLoomPanel = false;
      this.loomInput = '';
      this.loomError = '';
    },
    validate() {
      const errors = {};
      if (!this.form.title.trim()) errors.title = 'Title is required.';
      if (!this.form.knowledgeType) errors.knowledgeType = 'Knowledge Type is required.';
      if (!this.form.status) errors.status = 'Status is required.';
      this.errors = errors;
      if (Object.keys(errors).length > 0) this.showDetails = true;
      return Object.keys(errors).length === 0;
    },
    async submit() {
      this.errorMessage = '';
      this.successMessage = '';
      if (!this.validate()) return;

      this.saving = true;
      const payload = { ...this.form };

      try {
        const saved = this.isEdit
          ? await articlesService.updateArticle(this.editor.articleId, payload)
          : await articlesService.createArticle(payload);

        this.successMessage = 'Article saved successfully.';
        if (this.editor.onSaved) this.editor.onSaved(saved);
        setTimeout(() => {
          this.close();
        }, 500);
      } catch (err) {
        this.errorMessage = err.message || 'Could not save this article. Please try again.';
      } finally {
        this.saving = false;
      }
    },
    handleClose() {
      if (!this.saving) this.close();
    },
    close() {
      const { close } = useArticleEditor();
      close();
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-page {
  position: fixed;
  inset: 0;
  background: var(--zk-surface);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.editor-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  border-bottom: 1px solid var(--zk-border);
}

.editor-topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-body {
  flex: 1;
  overflow-y: auto;
}

.editor-form {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 32px 96px;
}

.page-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--zk-radius-md);
  background: var(--zk-success-bg);
  color: var(--zk-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 12px;
}

.title-input {
  display: block;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 38px;
  font-weight: 800;
  color: var(--zk-text);
  padding: 0;
  margin-bottom: 6px;

  &::placeholder {
    color: var(--zk-text-muted);
  }

  &.has-error {
    outline: 1px solid var(--zk-danger);
    border-radius: var(--zk-radius-sm);
  }
}

.view-details-toggle {
  display: inline-block;
  border: none;
  background: none;
  padding: 0;
  margin-bottom: 18px;
  font-size: 13px;
  font-weight: 500;
  color: var(--zk-text-muted);
  cursor: pointer;

  &:hover {
    color: var(--zk-primary);
    text-decoration: underline;
  }
}

.properties {
  margin-bottom: 20px;
}

.property-row {
  display: flex;
  align-items: flex-start;
  min-height: 36px;
  padding: 4px 0;
  border-radius: var(--zk-radius-sm);

  &:hover {
    background: var(--zk-bg);
  }
}

.property-label {
  flex: 0 0 170px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--zk-text-muted);
  padding: 7px 8px;

  .mdi {
    font-size: 16px;
  }
}

.property-value {
  flex: 1;
  min-width: 0;
  padding: 3px 8px;

  &.read-only {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--zk-text);
    padding-top: 10px;
  }
}

.avatar-chip {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--zk-primary);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.prop-input,
.prop-select,
.prop-textarea {
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  font-size: 14px;
  color: var(--zk-text);
  padding: 6px 8px;
  border-radius: var(--zk-radius-sm);
  font-family: inherit;

  &::placeholder {
    color: var(--zk-text-muted);
  }

  &:hover {
    border-color: var(--zk-border);
  }

  &:focus {
    outline: none;
    border-color: var(--zk-primary);
    background: var(--zk-surface);
  }

  &.has-error {
    border-color: var(--zk-danger);
  }
}

.prop-textarea {
  resize: vertical;
}

.tag-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 0;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--zk-border);
  background: var(--zk-surface);
  color: var(--zk-text-muted);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: var(--zk-primary);
    color: var(--zk-primary);
  }

  &.is-selected {
    background: var(--zk-primary);
    border-color: var(--zk-primary);
    color: #fff;
  }

  .mdi {
    font-size: 13px;
  }
}

.tag-add-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;

  .prop-input {
    border-color: var(--zk-border);
  }
}

.divider {
  border: none;
  border-top: 1px solid var(--zk-border);
  margin: 8px 0 28px;
}

.content-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.code-panel {
  border: 1px solid var(--zk-border);
  border-radius: var(--zk-radius-md);
  padding: 14px;
  margin-bottom: 16px;
  background: var(--zk-bg);
}

.code-panel-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: var(--zk-text-muted);
  }

  .select {
    width: auto;
  }
}

.code-input {
  font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
  font-size: 13px;
  resize: vertical;
}

.code-panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.content-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 8px;

  ::v-deep .quillWrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  ::v-deep .ql-toolbar.ql-snow {
    border: none;
    background: var(--zk-surface);
    padding-left: 0;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  ::v-deep .ql-container.ql-snow {
    flex: 1;
    border: none;
  }

  ::v-deep .ql-editor {
    flex: 1;
    height: auto;
    min-height: 300px;
    overflow-y: visible;
    padding: 16px 0 60px;
  }
}

.banner {
  padding: 10px 14px;
  border-radius: var(--zk-radius-sm);
  font-size: 13px;
  margin-bottom: 16px;
}

.banner-error {
  background: var(--zk-danger-bg);
  color: var(--zk-danger);
}

.banner-success {
  background: var(--zk-success-bg);
  color: var(--zk-success);
}
</style>
