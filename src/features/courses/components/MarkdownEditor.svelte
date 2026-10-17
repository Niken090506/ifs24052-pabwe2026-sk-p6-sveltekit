<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import "@toast-ui/editor/dist/toastui-editor.css";

  export let value: string = "";
  export let placeholder: string = "Tulis deskripsi dengan format Markdown...";
  export let height: string = "240px";
  export let textareaTestId: string = "markdown-editor-textarea";

  let editorContainer: HTMLElement;
  let editorInstance: any = null;
  let observer: MutationObserver | null = null;

  export function sanitizeEditorA11y() {
    if (!editorContainer) return;

    // 1. Convert non-standard aria-role attribute to standard role attribute
    const invalidRoles = editorContainer.querySelectorAll("[aria-role]");
    invalidRoles.forEach((el) => {
      const roleVal = el.getAttribute("aria-role");
      if (roleVal) {
        el.setAttribute("role", roleVal);
      }
      el.removeAttribute("aria-role");
    });

    // 2. Ensure parent of role="tab" elements has role="tablist"
    const tabs = editorContainer.querySelectorAll('[role="tab"], .tab-item');
    tabs.forEach((tab) => {
      tab.setAttribute("role", "tab");
      const parent = tab.parentElement;
      if (parent && parent.getAttribute("role") !== "tablist") {
        parent.setAttribute("role", "tablist");
        parent.removeAttribute("aria-role");
      }
    });

    // 3. Fix buttons without accessible names
    const buttons = editorContainer.querySelectorAll("button");
    buttons.forEach((btn) => {
      if (!btn.getAttribute("aria-label") && !btn.innerText?.trim()) {
        const title = btn.getAttribute("title");
        btn.setAttribute("aria-label", title || "Tombol Alat Editor");
      }
    });

    // 4. Fix pseudo clipboard textarea without accessible label
    const clipboards = editorContainer.querySelectorAll("textarea");
    clipboards.forEach((ta) => {
      if (!ta.getAttribute("aria-label")) {
        ta.setAttribute("aria-label", "Papan klip editor");
      }
    });
  }

  onMount(async () => {
    try {
      const { default: Editor } = await import("@toast-ui/editor");
      editorInstance = new Editor({
        el: editorContainer,
        height: height,
        initialEditType: "markdown",
        previewStyle: "tab",
        initialValue: value || "",
        placeholder: placeholder,
        usageStatistics: false,
        hideModeSwitch: false,
        events: {
          change: () => {
            value = editorInstance.getMarkdown();
          },
        },
      });

      sanitizeEditorA11y();

      if (typeof MutationObserver !== "undefined") {
        observer = new MutationObserver(() => {
          sanitizeEditorA11y();
        });
        observer.observe(editorContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["aria-role", "class"],
        });
      }
    } catch {
      editorInstance = null;
    }
  });

  $: if (editorInstance && value !== editorInstance.getMarkdown()) {
    editorInstance.setMarkdown(value || "");
  }

  function onTextareaInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    value = target.value;
    if (editorInstance) {
      editorInstance.setMarkdown(target.value);
    }
  }

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (editorInstance) {
      editorInstance.destroy();
      editorInstance = null;
    }
  });
</script>

<div class="toastui-editor-wrapper">
  <!-- Fallback hidden textarea with data-testid for accessibility and test compatibility -->
  <textarea
    data-testid={textareaTestId}
    {value}
    on:input={onTextareaInput}
    class="hidden"
    tabindex="-1"
    aria-hidden="true"
  ></textarea>
  <div bind:this={editorContainer} data-testid="markdown-editor-container"></div>
</div>

<style>
  .toastui-editor-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .toastui-editor-wrapper > div[data-testid="markdown-editor-container"] {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  :global(.toastui-editor-wrapper .toastui-editor-defaultUI) {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
    font-family: inherit;
  }
  :global(.toastui-editor-wrapper .toastui-editor-main) {
    flex: 1;
    min-height: 0;
  }
  :global(.toastui-editor-wrapper .toastui-editor-toolbar) {
    background-color: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
  }
  :global(.toastui-editor-wrapper .toastui-editor-contents) {
    font-family: inherit;
    font-size: 0.875rem;
  }
  :global(.toastui-editor-wrapper .tab-item) {
    color: #334155 !important;
    background-color: #cbd5e1 !important;
    font-weight: 600 !important;
  }
  :global(.toastui-editor-wrapper .tab-item.active) {
    color: #0f172a !important;
    background-color: #ffffff !important;
  }
  :global(.toastui-editor-wrapper .toastui-editor-mode-switch .tab-item) {
    color: #334155 !important;
    background-color: #e2e8f0 !important;
    font-weight: 600 !important;
  }
  :global(.toastui-editor-wrapper .toastui-editor-mode-switch .tab-item.active) {
    color: #0f172a !important;
    background-color: #ffffff !important;
  }
  :global(.toastui-editor-wrapper .placeholder),
  :global(.toastui-editor-wrapper .ProseMirror-widget.placeholder) {
    color: #475569 !important;
  }
</style>
