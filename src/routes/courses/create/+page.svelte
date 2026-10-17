<script lang="ts">
  import { Plus, ArrowLeft, LoaderCircle } from "lucide-svelte";
  import { coursesStore } from "../../../features/courses/states/coursesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import MarkdownEditor from "../../../features/courses/components/MarkdownEditor.svelte";
  import { goto } from "$app/navigation";

  let loading: boolean = false;
  let title: string = "";
  let description: string = "";

  $: if ($coursesStore.isCourseAdd) {
    loading = false;
    coursesStore.setIsCourseAdd(false);
    if ($coursesStore.isCourseAdded) {
      coursesStore.setIsCourseAdded(false);
      coursesStore.asyncSetCourses();
      goto("/");
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
    coursesStore.asyncSetIsCourseAdd(title.trim(), description.trim());
  }
</script>

<svelte:head>
  <title>Tambah Kursus - Delcom Courses</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center gap-4">
    <button
      type="button"
      data-testid="back-to-courses-btn"
      on:click={() => goto("/")}
      class="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
      aria-label="Kembali ke Semua Kursus"
    >
      <ArrowLeft size={20} />
    </button>
    <div>
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Tambah Kursus Baru</h1>
      <p class="text-sm text-slate-500">Buat kelas atau materi pelatihan baru untuk mahasiswa dan umum</p>
    </div>
  </div>

  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
    <div>
      <label for="create-course-title" class="block text-sm font-semibold text-slate-700 mb-2">
        Judul Kursus <span class="text-red-500">*</span>
      </label>
      <input
        id="create-course-title"
        data-testid="create-course-title-input"
        type="text"
        bind:value={title}
        placeholder="Misal: Pemrograman Web Modern dengan SvelteKit"
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm font-medium"
      />
    </div>

    <div>
      <label for="create-course-desc" class="block text-sm font-semibold text-slate-700 mb-2">
        Deskripsi Kursus (Markdown) <span class="text-red-500">*</span>
      </label>
      <div class="border border-slate-200 rounded-xl overflow-hidden min-h-[300px]">
        <MarkdownEditor
          bind:value={description}
          placeholder="Tulis silabus, prasyarat, atau ringkasan topik kursus..."
          height="300px"
          textareaTestId="create-course-desc-textarea"
        />
      </div>
    </div>

    <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
      <button
        type="button"
        data-testid="cancel-create-course-btn"
        on:click={() => goto("/")}
        disabled={loading}
        class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        Batal
      </button>
      <button
        type="button"
        data-testid="submit-create-course-btn"
        on:click={handleSave}
        disabled={loading}
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
      >
        {#if loading}
          <LoaderCircle size={18} class="animate-spin" />
          <span>Menyimpan...</span>
        {:else}
          <Plus size={18} />
          <span>Tambah Kursus</span>
        {/if}
      </button>
    </div>
  </div>
</div>
