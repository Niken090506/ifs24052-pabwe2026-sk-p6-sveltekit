<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { PenLine, X, LoaderCircle } from "lucide-svelte";
  import { coursesStore } from "../states/coursesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";
  import type { Course } from "../api/courseApi";

  export let show: boolean = false;
  export let course: Course | null = null;
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  let loading: boolean = false;
  let title: string = "";
  let description: string = "";

  function handleClose() {
    dispatch("close");
    if (onClose) onClose();
  }

  $: {
    if (show) {
      document.body.style.overflow = "hidden";
      if (course) {
        title = course.title || "";
        description = course.description || "";
      }
    } else {
      document.body.style.overflow = "auto";
    }
  }

  $: if ($coursesStore.isCourseChange) {
    loading = false;
    coursesStore.setIsCourseChange(false);
    if ($coursesStore.isCourseChanged) {
      coursesStore.setIsCourseChanged(false);
      if (course) {
        coursesStore.asyncSetCourse(course.id);
      }
      handleClose();
    }
  }

  function handleSave() {
    if (!title.trim()) {
      showErrorDialog("Judul kursus tidak boleh kosong");
      return;
    }

    if (!description.trim()) {
      showErrorDialog("Deskripsi kursus tidak boleh kosong");
      return;
    }

    loading = true;
    coursesStore.asyncSetIsCourseChange(course.id, title.trim(), description.trim());
  }
</script>

{#if show && course}
  <div
    data-testid="change-course-modal"
    class="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-200"
  >
    <!-- Modal Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
          <PenLine size={24} />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800">Ubah Data Kursus</h2>
          <p class="text-xs text-slate-500">Perbarui judul dan deskripsi kursus</p>
        </div>
      </div>
      <button
        type="button"
        data-testid="close-change-course-modal-btn"
        on:click={handleClose}
        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label="Tutup Modal"
      >
        <X size={20} />
      </button>
    </header>

    <!-- Modal Body -->
    <div class="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-6">
      <div>
        <label for="edit-course-title-input" class="block text-sm font-semibold text-slate-700 mb-2">
          Judul Kursus <span class="text-red-500">*</span>
        </label>
        <input
          id="edit-course-title-input"
          data-testid="edit-course-title-input"
          type="text"
          bind:value={title}
          placeholder="Judul kursus..."
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm font-medium"
        />
      </div>

      <div class="flex flex-col flex-1">
        <label for="edit-course-description-editor" class="block text-sm font-semibold text-slate-700 mb-2">
          Deskripsi Kursus (Markdown) <span class="text-red-500">*</span>
        </label>
        <div class="border border-slate-200 rounded-xl overflow-hidden min-h-[320px]">
          <MarkdownEditor
            bind:value={description}
            placeholder="Deskripsi kursus..."
            height="320px"
            textareaTestId="edit-course-description-textarea"
          />
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <footer class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
      <button
        type="button"
        data-testid="cancel-change-course-btn"
        on:click={handleClose}
        disabled={loading}
        class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        Batal
      </button>
      <button
        type="button"
        data-testid="save-change-course-btn"
        on:click={handleSave}
        disabled={loading}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
      >
        {#if loading}
          <LoaderCircle size={18} class="animate-spin" />
          <span>Menyimpan...</span>
        {:else}
          <PenLine size={18} />
          <span>Simpan Perubahan</span>
        {/if}
      </button>
    </footer>
  </div>
{/if}
