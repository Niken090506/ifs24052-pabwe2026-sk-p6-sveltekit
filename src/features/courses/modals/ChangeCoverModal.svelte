<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ImagePlus, X, LoaderCircle, Upload } from "lucide-svelte";
  import { coursesStore } from "../states/coursesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";
  import type { Course } from "../api/courseApi";

  export let show: boolean = false;
  export let course: Course | null = null;
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  let loading: boolean = false;
  let file: File | null = null;
  let previewUrl: string | null = null;

  function handleClose() {
    previewUrl = null;
    file = null;
    dispatch("close");
    if (onClose) onClose();
  }

  $: {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  $: if ($coursesStore.isCourseChangeCover) {
    loading = false;
    coursesStore.setIsCourseChangeCover(false);
    if ($coursesStore.isCourseChangedCover) {
      coursesStore.setIsCourseChangedCover(false);
      if (course) {
        coursesStore.asyncSetCourse(course.id);
      }
      handleClose();
    }
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showErrorDialog("Pilih file gambar (JPG/PNG)!");
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      showErrorDialog("Ukuran gambar maksimal 1MB!");
      return;
    }

    file = selectedFile;
    previewUrl = URL.createObjectURL(selectedFile);
  }

  function handleUpload() {
    if (!course) return;

    if (!file) {
      showErrorDialog("Silakan pilih file cover terlebih dahulu!");
      return;
    }

    loading = true;
    coursesStore.asyncSetIsCourseChangeCover(course.id, file);
  }
</script>

{#if show && course}
  <div
    data-testid="change-cover-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <ImagePlus size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-800">Ubah Cover Kursus</h3>
            <p class="text-xs text-slate-500">Unggah gambar sampul kursus (maks. 1MB)</p>
          </div>
        </div>
        <button
          type="button"
          data-testid="close-change-cover-modal-btn"
          on:click={handleClose}
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <!-- Preview Area -->
        <div class="relative w-full h-44 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 transition-colors">
          {#if previewUrl}
            <img
              src={previewUrl}
              alt="Preview Cover"
              class="w-full h-full object-cover"
              data-testid="cover-preview-img"
            />
          {:else if course.cover}
            <img
              src={course.cover}
              alt={course.title}
              class="w-full h-full object-cover"
            />
          {:else}
            <Upload size={32} class="mb-2 text-slate-300" />
            <p class="text-xs font-semibold text-slate-500">Pilih berkas cover</p>
            <p class="text-[11px] text-slate-400">JPG atau PNG, maks. 1MB</p>
          {/if}
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            id="cover-file-input"
            data-testid="cover-file-input"
            on:change={handleFileChange}
            class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
          />
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            data-testid="cancel-change-cover-btn"
            on:click={handleClose}
            disabled={loading}
            class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            data-testid="upload-cover-btn"
            on:click={handleUpload}
            disabled={loading}
            class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
          >
            {#if loading}
              <LoaderCircle size={16} class="animate-spin" />
              <span>Mengunggah...</span>
            {:else}
              <Upload size={16} />
              <span>Simpan Cover</span>
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
