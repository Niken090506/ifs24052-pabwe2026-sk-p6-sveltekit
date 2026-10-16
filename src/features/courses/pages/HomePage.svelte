<script lang="ts">
  import { onMount } from "svelte";
  import AddModal from "../modals/AddModal.svelte";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
  import {
    Plus,
    GraduationCap,
    Trash2,
    Search,
    BookOpen,
    Users,
    Star,
    ArrowRight,
    LoaderCircle,
  } from "lucide-svelte";
  import type { Course } from "../api/courseApi";

  let loadingCourses: boolean = false;
  let filter: string = "";
  let searchQuery: string = "";
  let showAddModal: boolean = false;

  $: profile = $usersStore.profile;
  $: courses = $coursesStore.courses || [];

  onMount(() => {
    loadCourses();
  });

  function loadCourses() {
    loadingCourses = true;
    Promise.resolve(coursesStore.asyncSetCourses(filter)).finally(() => {
      loadingCourses = false;
    });
  }

  let prevFilter = filter;
  $: if (filter !== prevFilter) {
    prevFilter = filter;
    loadCourses();
  }

  $: if ($coursesStore.isCourseDeleted) {
    coursesStore.setIsCourseDeleted(false);
    loadCourses();
  }

  $: if ($coursesStore.isCoursesDeleted) {
    coursesStore.setIsCoursesDeleted(false);
    loadCourses();
  }

  async function handleDeleteCourse(courseId: number) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus kursus ini?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCourseDelete(courseId);
    }
  }

  async function handleDeleteAllCourses() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus semua kursus?");
    if (result.isConfirmed) {
      coursesStore.asyncSetIsCoursesDelete();
    }
  }

  $: filteredCourses = courses.filter((course: Course) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = course.title ? course.title.toLowerCase() : "";
    const description = course.description ? course.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });
</script>

{#if profile}
  <div class="space-y-8 animate-in fade-in duration-300">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Semua Kursus
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Jelajahi beragam modul pelatihan dan tingkatkan keahlian Anda.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        {#if courses.length > 0}
          <button
            type="button"
            data-testid="delete-all-courses-btn"
            on:click={handleDeleteAllCourses}
            class="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-all"
          >
            <Trash2 size={16} />
            <span>Hapus Semua</span>
          </button>
        {/if}

        <button
          type="button"
          data-testid="add-course-btn"
          on:click={() => (showAddModal = true)}
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Tambah Kursus</span>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div class="relative flex-1 max-w-md">
        <Search
          size={18}
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          data-testid="search-course-input"
          bind:value={searchQuery}
          placeholder="Cari berdasarkan judul atau deskripsi..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-xs"
        />
      </div>

      <div class="flex items-center gap-2">
        <select
          data-testid="filter-course-select"
          bind:value={filter}
          class="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-xs transition-all"
        >
          <option value="">Semua Kursus</option>
          <option value="1">Kursus Saya</option>
        </select>
      </div>
    </div>

    <!-- Course Grid -->
    {#if loadingCourses && filteredCourses.length === 0}
      <div class="flex flex-col items-center justify-center py-20">
        <LoaderCircle size={36} class="animate-spin text-indigo-600" />
        <p class="text-sm font-medium text-slate-500 mt-3">Memuat daftar kursus...</p>
      </div>
    {:else if filteredCourses.length === 0}
      <div
        data-testid="empty-courses"
        class="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 text-center"
      >
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
          <BookOpen size={32} />
        </div>
        <h3 class="text-base font-bold text-slate-800">Belum Ada Kursus</h3>
        <p class="text-sm text-slate-500 max-w-sm mt-1">
          {searchQuery ? "Tidak ada kursus yang cocok dengan pencarian Anda." : "Belum ada kursus yang tersedia. Tambahkan kursus pertama Anda!"}
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredCourses as course (course.id)}
          {@const isOwner = course.user_id === profile.id}
          <div
            data-testid={`course-card-${course.id}`}
            class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col overflow-hidden group"
          >
            <!-- Cover Image -->
            <a href={`/courses/${course.id}`} class="block relative h-44 bg-slate-100 overflow-hidden">
              {#if course.cover}
                <img
                  src={course.cover}
                  alt={course.title}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              {:else}
                <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-indigo-50 text-indigo-400">
                  <GraduationCap size={44} strokeWidth={1.5} />
                </div>
              {/if}

              {#if isOwner}
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                  Milik Saya
                </span>
              {/if}
            </a>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <a href={`/courses/${course.id}`} class="block">
                  <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                </a>
                <p class="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  {course.description || "Tidak ada deskripsi"}
                </p>
              </div>

              <!-- Meta Footer -->
              <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-3 text-xs text-slate-500">
                  <span class="inline-flex items-center gap-1 text-amber-600 font-semibold">
                    <Star size={14} class="fill-amber-400 text-amber-400" />
                    {course.average_rating ? course.average_rating.toFixed(1) : "0.0"}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <Users size={14} />
                    {course.total_students ?? (course.students ? course.students.length : 0)}
                  </span>
                </div>

                <div class="flex items-center gap-1">
                  {#if isOwner}
                    <button
                      type="button"
                      data-testid={`delete-course-btn-${course.id}`}
                      on:click={() => handleDeleteCourse(course.id)}
                      class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Kursus"
                      aria-label="Hapus Kursus"
                    >
                      <Trash2 size={16} />
                    </button>
                  {/if}
                  <a
                    href={`/courses/${course.id}`}
                    class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 p-2"
                  >
                    <span>Detail</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <AddModal
    show={showAddModal}
    onClose={() => (showAddModal = false)}
  />
{/if}
