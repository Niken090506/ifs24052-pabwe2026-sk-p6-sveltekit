<script lang="ts">
  import { PenLine, ArrowLeft, LoaderCircle } from "lucide-svelte";
  import { coursesStore } from "../../../features/courses/states/coursesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import MarkdownEditor from "../../../features/courses/components/MarkdownEditor.svelte";
  import { goto } from "$app/navigation";

  let loading: boolean = false;
  let title: string = "";
  let description: string = "";

  $: course = $coursesStore.course;

  $: if (course) {
    if (!title && !description) {
      title = course.title || "";
      description = course.description || "";
    }
  }

  $: if ($coursesStore.isCourseChange) {
    loading = false;
    coursesStore.setIsCourseChange(false);
    if ($coursesStore.isCourseChanged) {
      coursesStore.setIsCourseChanged(false);
      goto(course ? `/courses/${course.id}` : "/");
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

    if (course) {
      loading = true;
      coursesStore.asyncSetIsCourseChange(course.id, title.trim(), description.trim());
    } else {
      goto("/");
    }
  }
</script>

<svelte:head>
  <title>Ubah Kursus - Delcom Courses</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center gap-4">
    <button
      type="button"
      data-testid="back-from-edit-btn"
      on:click={() => goto("/")}
      class="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
      aria-label="Kembali"
    >
      <ArrowLeft size={20} />
    </button>
    <div>
      <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Ubah Informasi Kursus</h1>
      <p class="text-sm text-slate-500">Perbarui judul dan rincian silabus kursus</p>
    </div>
  </div>

  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
    <div>
      <label for="edit-course-title" class="block text-sm font-semibold text-slate-700 mb-2">
        Judul Kursus <span class="text-red-500">*</span>
      </label>
      <input
        id="edit-course-title"
        data-testid="edit-course-title-input"
        type="text"
        bind:value={title}
        placeholder="Judul kursus..."
        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm font-medium"
      />
    </div>

    <div>
      <label for="edit-course-desc" class="block text-sm font-semibold text-slate-700 mb-2">
        Deskripsi Kursus (Markdown) <span class="text-red-500">*</span>
      </label>
      <div class="border border-slate-200 rounded-xl overflow-hidden min-h-[300px]">
        <MarkdownEditor
          bind:value={description}
          placeholder="Deskripsi kursus..."
          height="300px"
          textareaTestId="edit-course-desc-textarea"
        />
      </div>
    </div>

    <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
      <button
        type="button"
        data-testid="cancel-edit-course-btn"
        on:click={() => goto("/")}
        disabled={loading}
        class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        Batal
      </button>
      <button
        type="button"
        data-testid="submit-edit-course-btn"
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
    </div>
  </div>
</div>
