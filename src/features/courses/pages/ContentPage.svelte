<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import MarkdownViewer from "../components/MarkdownViewer.svelte";
  import { coursesStore } from "../states/coursesStore";
  import { usersStore } from "../../users/states/usersStore";
  import {
    ArrowLeft,
    Video,
    CheckCircle2,
    Circle,
    Calendar,
    LoaderCircle,
  } from "lucide-svelte";

  export let courseId: string | number;
  export let contentId: string | number;

  $: profile = $usersStore.profile;
  $: content = $coursesStore.content;

  onMount(() => {
    if (contentId) {
      coursesStore.asyncSetContent(contentId);
    }
  });

  let prevContentId = contentId;
  $: if (contentId !== prevContentId) {
    prevContentId = contentId;
    coursesStore.asyncSetContent(contentId);
  }

  $: if ($coursesStore.isContent) {
    coursesStore.setIsContent(false);
    if (!content) {
      goto(`/courses/${courseId}`);
    }
  }

  $: if ($coursesStore.isContentStatusChange) {
    coursesStore.setIsContentStatusChange(false);
    if ($coursesStore.isContentStatusChanged) {
      coursesStore.setIsContentStatusChanged(false);
      coursesStore.asyncSetContent(contentId);
    }
  }

  function getYouTubeEmbedUrl(url: string | undefined): string | null {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes("youtube.com")) {
        const v = parsed.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}`;
        if (parsed.pathname.startsWith("/embed/")) return url;
      } else if (parsed.hostname.includes("youtu.be")) {
        const id = parsed.pathname.slice(1);
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    } catch {
      return null;
    }
    return null;
  }

  $: embedUrl = getYouTubeEmbedUrl(content?.youtube_url);
  $: isFinished = !!content?.is_finished;

  function handleToggleFinished() {
    const nextStatus = isFinished ? 0 : 1;
    coursesStore.asyncSetIsContentStatus(content!.id, nextStatus);
  }
</script>

{#if !profile || !content}
  <div class="flex flex-col items-center justify-center py-20">
    <LoaderCircle size={36} class="animate-spin text-indigo-600" />
    <p class="text-sm font-medium text-slate-500 mt-3">Memuat materi pembelajaran...</p>
  </div>
{:else}
  <div class="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
    <!-- Back to Course Link -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <a
        href={`/courses/${courseId}`}
        data-testid="back-to-course-detail-link"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke Detail Kursus
      </a>

      <!-- Status Toggle Button -->
      <button
        type="button"
        data-testid="toggle-finished-btn"
        on:click={handleToggleFinished}
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all {isFinished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/25'}"
      >
        {#if isFinished}
          <CheckCircle2 size={16} class="text-emerald-600" />
          <span>Selesai Dipelajari</span>
        {:else}
          <Circle size={16} />
          <span>Tandai Selesai Belajar</span>
        {/if}
      </button>
    </div>

    <!-- Main Content Container -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      <!-- Title & Header -->
      <div class="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
        <div class="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-2">
          <Video size={16} />
          <span>Materi Pembelajaran</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {content.title}
        </h1>
      </div>

      <!-- YouTube Player if URL exists -->
      {#if embedUrl}
        <div class="aspect-video w-full bg-black">
          <iframe
            src={embedUrl}
            title={content.title}
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            data-testid="youtube-iframe"
          ></iframe>
        </div>
      {/if}

      <!-- Markdown Body -->
      <div class="p-6 sm:p-8">
        <h2 class="text-base font-bold text-slate-900 mb-4">Uraian Materi</h2>
        <div class="text-slate-700 leading-relaxed text-sm">
          <MarkdownViewer content={content.content || ""} />
        </div>
      </div>
    </div>
  </div>
{/if}
