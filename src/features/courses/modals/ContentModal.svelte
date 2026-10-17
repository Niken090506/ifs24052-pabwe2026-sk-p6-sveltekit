<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Video, Plus, PenLine, X, LoaderCircle } from "lucide-svelte";
  import { coursesStore } from "../states/coursesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";
  import type { CourseContent } from "../api/courseApi";

  export let show: boolean = false;
  export let courseId: string | number | null = null;
  export let content: CourseContent | null = null;
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  let loading: boolean = false;
  let title: string = "";
  let youtubeUrl: string = "";
  let bodyContent: string = "";

  function handleClose() {
    title = "";
    youtubeUrl = "";
    bodyContent = "";
    dispatch("close");
    if (onClose) onClose();
  }

  $: {
    if (show) {
      document.body.style.overflow = "hidden";
      if (content) {
        title = content.title || "";
        youtubeUrl = content.youtube_url || "";
        bodyContent = content.content || "";
      } else {
        title = "";
        youtubeUrl = "";
        bodyContent = "";
      }
    } else {
      document.body.style.overflow = "auto";
    }
  }

  $: if ($coursesStore.isContentAdd) {
    loading = false;
    coursesStore.setIsContentAdd(false);
    if ($coursesStore.isContentAdded) {
      coursesStore.setIsContentAdded(false);
      if (courseId) {
        coursesStore.asyncSetCourse(courseId);
      }
      handleClose();
    }
  }

  $: if ($coursesStore.isContentChange) {
    loading = false;
    coursesStore.setIsContentChange(false);
    if ($coursesStore.isContentChanged) {
      coursesStore.setIsContentChanged(false);
      if (courseId) {
        coursesStore.asyncSetCourse(courseId);
      }
      handleClose();
    }
  }

  function handleSave() {
    if (!title.trim()) {
      showErrorDialog("Judul materi tidak boleh kosong");
      return;
    }

    if (youtubeUrl.trim()) {
      try {
        new URL(youtubeUrl.trim());
      } catch {
        showErrorDialog("Alamat tautan video tidak valid!");
        return;
      }
    }

    if (!bodyContent.trim()) {
      showErrorDialog("Isi materi pembelajaran tidak boleh kosong");
      return;
    }

    loading = true;
    if (content) {
      coursesStore.asyncSetIsContentChange(
        courseId,
        content.id,
        title.trim(),
        youtubeUrl.trim(),
        bodyContent.trim()
      );
    } else {
      coursesStore.asyncSetIsContentAdd(
        courseId,
        title.trim(),
        youtubeUrl.trim(),
        bodyContent.trim()
      );
    }
  }
</script>

{#if show && courseId}
  <div
    data-testid="content-modal"
    class="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-200"
  >
    <!-- Modal Header -->
    <header class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          {#if content}
            <PenLine size={22} />
          {:else}
            <Plus size={22} />
          {/if}
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-800">
            {content ? "Ubah Materi Pembelajaran" : "Tambah Materi Baru"}
          </h2>
          <p class="text-xs text-slate-500">
            {content ? "Perbarui materi atau video penjelasan kursus" : "Masukkan judul materi, video, dan panduan belajar"}
          </p>
        </div>
      </div>
      <button
        type="button"
        data-testid="close-content-modal-btn"
        on:click={handleClose}
        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        aria-label="Tutup Modal"
      >
        <X size={20} />
      </button>
    </header>

    <!-- Modal Body -->
    <div class="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-5">
      <div>
        <label for="content-title-input" class="block text-sm font-semibold text-slate-700 mb-2">
          Judul Materi <span class="text-red-500">*</span>
        </label>
        <input
          id="content-title-input"
          data-testid="content-title-input"
          type="text"
          bind:value={title}
          placeholder="Misal: Pengantar Routing SvelteKit 3"
          class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm font-medium"
        />
      </div>

      <div>
        <label for="content-youtube-input" class="block text-sm font-semibold text-slate-700 mb-2">
          Tautan Video YouTube (Opsional)
        </label>
        <div class="relative">
          <Video
            size={18}
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="content-youtube-input"
            data-testid="content-youtube-input"
            type="url"
            bind:value={youtubeUrl}
            placeholder="https://www.youtube.com/watch?v=..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div class="flex flex-col flex-1">
        <label for="content-body-editor" class="block text-sm font-semibold text-slate-700 mb-2">
          Isi Materi (Markdown) <span class="text-red-500">*</span>
        </label>
        <div class="border border-slate-200 rounded-xl overflow-hidden min-h-[300px]">
          <MarkdownEditor
            bind:value={bodyContent}
            placeholder="Tulis materi penjelasan, kode contoh, dan referensi..."
            height="300px"
            textareaTestId="content-body-textarea"
          />
        </div>
      </div>
    </div>

    <!-- Modal Footer -->
    <footer class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
      <button
        type="button"
        data-testid="cancel-content-btn"
        on:click={handleClose}
        disabled={loading}
        class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        Batal
      </button>
      <button
        type="button"
        data-testid="save-content-btn"
        on:click={handleSave}
        disabled={loading}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
      >
        {#if loading}
          <LoaderCircle size={18} class="animate-spin" />
          <span>Menyimpan...</span>
        {:else if content}
          <PenLine size={18} />
          <span>Simpan Perubahan</span>
        {:else}
          <Plus size={18} />
          <span>Tambah Materi</span>
        {/if}
      </button>
    </footer>
  </div>
{/if}
