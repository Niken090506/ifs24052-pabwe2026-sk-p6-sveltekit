<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ContentModal from "../modals/ContentModal.svelte";
  import MarkdownViewer from "../components/MarkdownViewer.svelte";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
  import {
    ArrowLeft,
    ImagePlus,
    PenLine,
    Trash2,
    Calendar,
    Users,
    Star,
    Video,
    Plus,
    BookOpen,
    CheckCircle2,
    Circle,
    UserCheck,
    LogOut,
    Play,
    LoaderCircle,
  } from "lucide-svelte";
  import type { CourseContent } from "../api/courseApi";

  export let courseId: string | number;

  $: profile = $usersStore.profile;
  $: course = $coursesStore.course;

  let showCoverModal: boolean = false;
  let showEditModal: boolean = false;
  let showContentModal: boolean = false;
  let selectedContent: CourseContent | null = null;
  let selectedRating: number = 5;

  onMount(() => {
    if (courseId) {
      coursesStore.asyncSetCourse(courseId);
    }
  });

  let prevId = courseId;
  $: if (courseId !== prevId) {
    prevId = courseId;
    coursesStore.asyncSetCourse(courseId);
  }

  $: if ($coursesStore.isCourse) {
    coursesStore.setIsCourse(false);
    if (!course) {
      goto("/");
    }
  }

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    goto("/");
  }

  $: if ($coursesStore.isStudentRegister) {
    coursesStore.setIsStudentRegister(false);
    if ($coursesStore.isStudentRegistered) {
      coursesStore.setIsStudentRegistered(false);
      coursesStore.asyncSetCourse(courseId);
    }
  }

  $: if ($coursesStore.isStudentUnregister) {
    coursesStore.setIsStudentUnregister(false);
    if ($coursesStore.isStudentUnregistered) {
      coursesStore.setIsStudentUnregistered(false);
      coursesStore.asyncSetCourse(courseId);
    }
  }

  $: if ($coursesStore.isRatingAdd) {
    coursesStore.setIsRatingAdd(false);
    if ($coursesStore.isRatingAdded) {
      coursesStore.setIsRatingAdded(false);
      coursesStore.asyncSetCourse(courseId);
    }
  }

  $: if ($coursesStore.isContentDeleted) {
    coursesStore.setIsContentDeleted(false);
    coursesStore.asyncSetCourse(courseId);
  }

  // Antarmuka pemilik ditampilkan lebih dulu bila keduanya terpenuhi
  $: isOwner = profile && course ? course.user_id === profile.id : false;
  $: isStudent = profile && course && !isOwner
    ? !!course.students?.some((s) => s.id === profile.id || s.user_id === profile.id)
    : false;

  async function handleDeleteCourse() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDelete(course!.id);
    }
  }

  async function handleEnroll() {
    coursesStore.asyncSetIsStudentRegister(course!.id);
  }

  async function handleLeave() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin keluar dari kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsStudentUnregister(course!.id);
    }
  }

  async function handleSendRating() {
    coursesStore.asyncSetIsRatingAdd(course!.id, Number(selectedRating));
  }

  function handleAddContent() {
    selectedContent = null;
    showContentModal = true;
  }

  function handleEditContent(item: CourseContent) {
    selectedContent = item;
    showContentModal = true;
  }

  async function handleDeleteContent(contentId: number) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus materi ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsContentDelete(course!.id, contentId);
    }
  }
</script>

{#if !profile || !course}
  <div class="flex flex-col items-center justify-center py-20">
    <LoaderCircle size={36} class="animate-spin text-indigo-600" />
    <p class="text-sm font-medium text-slate-500 mt-3">Memuat detail kursus...</p>
  </div>
{:else}
  <div class="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
    <!-- Top Action Nav -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <a
        href="/"
        data-testid="back-to-courses-link"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke Semua Kursus
      </a>

      <!-- Action Buttons based on Role -->
      <div class="flex flex-wrap items-center gap-2">
        {#if isOwner}
          <button
            type="button"
            data-testid="edit-cover-btn"
            on:click={() => (showCoverModal = true)}
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors"
          >
            <ImagePlus size={16} />
            Ubah Cover
          </button>
          <button
            type="button"
            data-testid="edit-course-btn"
            on:click={() => (showEditModal = true)}
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
          >
            <PenLine size={16} />
            Ubah Data
          </button>
          <button
            type="button"
            data-testid="delete-course-btn"
            on:click={handleDeleteCourse}
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
          >
            <Trash2 size={16} />
            Hapus Kursus
          </button>
        {:else if isStudent}
          <button
            type="button"
            data-testid="leave-course-btn"
            on:click={handleLeave}
            class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
          >
            <LogOut size={16} />
            Keluar Kursus
          </button>
        {:else}
          <button
            type="button"
            data-testid="enroll-course-btn"
            on:click={handleEnroll}
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/25 transition-all"
          >
            <UserCheck size={16} />
            Daftar Kursus
          </button>
        {/if}
      </div>
    </div>

    <!-- Header Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div class="relative h-64 sm:h-80 w-full bg-slate-900">
        {#if course.cover}
          <img
            src={course.cover}
            alt={course.title}
            class="w-full h-full object-cover"
          />
        {:else}
          <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white/50">
            <BookOpen size={64} strokeWidth={1.5} class="text-indigo-400 mb-2" />
            <span class="text-sm font-semibold tracking-wider uppercase text-slate-300">Delcom Courses</span>
          </div>
        {/if}
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6 text-white">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            {#if isOwner}
              <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-white">
                Pemilik Kursus
              </span>
            {:else if isStudent}
              <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500 text-white">
                Peserta Terdaftar
              </span>
            {/if}
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {course.title}
          </h1>
        </div>
      </div>

      <!-- Info Meta Bar -->
      <div class="p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-6 text-sm text-slate-600">
          <div class="flex items-center gap-2">
            <Star size={18} class="fill-amber-400 text-amber-400" />
            <span class="font-bold text-slate-900">
              {course.average_rating ? course.average_rating.toFixed(1) : "0.0"}
            </span>
            <span class="text-xs text-slate-500">
              ({course.ratings ? course.ratings.length : 0} rating)
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Users size={18} class="text-slate-400" />
            <span class="font-bold text-slate-900">
              {course.total_students ?? (course.students ? course.students.length : 0)}
            </span>
            <span class="text-xs text-slate-500">Peserta</span>
          </div>
          {#if course.created_at}
            <div class="flex items-center gap-2">
              <Calendar size={18} class="text-slate-400" />
              <span>{formatDate(course.created_at)}</span>
            </div>
          {/if}
        </div>

        {#if isStudent}
          <!-- Rating Form for enrolled students -->
          <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <span class="text-xs font-semibold text-slate-700">Beri Rating:</span>
            <select
              data-testid="select-rating"
              bind:value={selectedRating}
              aria-label="Pilih rating kursus"
              class="text-xs font-semibold text-amber-800 border-none focus:ring-0 bg-transparent cursor-pointer"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>
            <button
              type="button"
              data-testid="submit-rating-btn"
              on:click={handleSendRating}
              class="px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Kirim
            </button>
          </div>
        {/if}
      </div>

      <!-- Description Body -->
      <div class="p-6 sm:p-8">
        <h2 class="text-lg font-bold text-slate-900 mb-3">Tentang Kursus Ini</h2>
        <div class="text-slate-600 leading-relaxed text-sm">
          <MarkdownViewer content={course.description} />
        </div>
      </div>
    </div>

    <!-- Contents Section -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Materi Pembelajaran</h2>
          <p class="text-xs text-slate-500 mt-1">Daftar video dan panduan materi kursus</p>
        </div>

        {#if isOwner}
          <button
            type="button"
            data-testid="add-content-btn"
            on:click={handleAddContent}
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Tambah Materi</span>
          </button>
        {/if}
      </div>

      {#if !course.contents || course.contents.length === 0}
        <div data-testid="empty-contents" class="text-center py-12 text-slate-400">
          <Video size={40} class="mx-auto text-slate-300 mb-2" />
          <p class="text-sm font-medium">Belum ada materi pembelajaran yang ditambahkan.</p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each course.contents as item, idx (item.id)}
            <div
              data-testid={`content-item-${item.id}`}
              class="flex items-center justify-between p-4 rounded-2xl border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all gap-4"
            >
              <div class="flex items-center gap-3.5 flex-1 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </div>

                <div class="min-w-0 flex-1">
                  <a
                    href={`/courses/${course.id}/contents/${item.id}`}
                    class="block font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors truncate"
                  >
                    {item.title}
                  </a>
                  <div class="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    {#if item.youtube_url}
                      <span class="inline-flex items-center gap-1 text-red-600 font-medium">
                        <Video size={13} />
                        Video
                      </span>
                    {/if}
                    {#if item.is_finished}
                      <span class="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 size={13} />
                        Selesai
                      </span>
                    {/if}
                  </div>
                </div>
              </div>

              <!-- Content Actions -->
              <div class="flex items-center gap-1 shrink-0">
                {#if isOwner}
                  <button
                    type="button"
                    data-testid={`edit-content-btn-${item.id}`}
                    on:click={() => handleEditContent(item)}
                    class="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Ubah Materi"
                    aria-label="Ubah Materi"
                  >
                    <PenLine size={16} />
                  </button>
                  <button
                    type="button"
                    data-testid={`delete-content-btn-${item.id}`}
                    on:click={() => handleDeleteContent(item.id)}
                    class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Materi"
                    aria-label="Hapus Materi"
                  >
                    <Trash2 size={16} />
                  </button>
                {/if}
                <a
                  href={`/courses/${course.id}/contents/${item.id}`}
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  <Play size={13} />
                  <span>Buka</span>
                </a>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Students & Enrolled List (for Owner) -->
    {#if isOwner && course.students && course.students.length > 0}
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
        <h2 class="text-xl font-bold text-slate-900">Daftar Peserta Terdaftar ({course.students.length})</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {#each course.students as student}
            <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div class="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {student.name ? student.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div class="truncate">
                <p class="text-xs font-bold text-slate-800 truncate">{student.name || "Peserta"}</p>
                <p class="text-[11px] text-slate-500 truncate">{student.email || ""}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Modals -->
  <ChangeCoverModal
    show={showCoverModal}
    {course}
    onClose={() => (showCoverModal = false)}
  />

  <ChangeModal
    show={showEditModal}
    {course}
    onClose={() => (showEditModal = false)}
  />

  <ContentModal
    show={showContentModal}
    courseId={course.id}
    content={selectedContent}
    onClose={() => (showContentModal = false)}
  />
{/if}
