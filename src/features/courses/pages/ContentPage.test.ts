import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentPage from "./ContentPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import { mockGoto } from "../../../setupTests";

describe("ContentPage", () => {
  const mockProfile = { id: 1, name: "Student User", email: "student@delcom.org" };
  const mockContentWithVideo = {
    id: 10,
    course_id: 1,
    title: "Video Tutorial SvelteKit",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: "Penjelasan detail mengenai materi ini.",
    is_finished: 0,
  };

  const mockContentYoutuBe = {
    id: 11,
    course_id: 1,
    title: "Materi Short URL",
    youtube_url: "https://youtu.be/dQw4w9WgXcQ",
    content: "Penjelasan format short",
    is_finished: 1,
  };

  const mockContentEmbed = {
    id: 12,
    course_id: 1,
    title: "Materi Embed Direct",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    content: "Penjelasan format embed",
    is_finished: 0,
  };

  const mockContentInvalidUrl = {
    id: 13,
    course_id: 1,
    title: "Materi Tanpa Video Valid",
    youtube_url: "invalid-url-string",
    content: "Teks saja",
    is_finished: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loader when profile or content is null", () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: {
        profile: mockProfile,
        content: null,
      },
    });

    expect(wrapper.text()).toContain("Memuat materi pembelajaran...");
  });

  it("should render content with youtube iframe player and toggle button", async () => {
    const { wrapper } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentWithVideo,
      },
    });

    expect(wrapper.text()).toContain("Video Tutorial SvelteKit");
    expect(wrapper.find('[data-testid="youtube-iframe"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="toggle-finished-btn"]').text()).toContain("Tandai Selesai Belajar");
  });

  it("should handle youtube short url and direct embed url", () => {
    const { wrapper: w1 } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 11 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentYoutuBe,
      },
    });
    expect(w1.find('[data-testid="youtube-iframe"]').attributes("src")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(w1.find('[data-testid="toggle-finished-btn"]').text()).toContain("Selesai Dipelajari");

    const { wrapper: w2 } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 12 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentEmbed,
      },
    });
    expect(w2.find('[data-testid="youtube-iframe"]').attributes("src")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");

    const { wrapper: w3 } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 13 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentInvalidUrl,
      },
    });
    expect(w3.find('[data-testid="youtube-iframe"]').exists()).toBe(false);
  });

  it("should toggle finished status when toggle button is clicked", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentWithVideo,
      },
    });

    const statusSpy = vi.spyOn(coursesStore, "asyncSetIsContentStatus").mockImplementation(() => Promise.resolve());
    const toggleBtn = wrapper.find('[data-testid="toggle-finished-btn"]');
    await toggleBtn.trigger("click");

    expect(statusSpy).toHaveBeenCalledWith(10, 1);
  });

  it("should toggle unfinished status when already finished", async () => {
    const { wrapper, coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 11 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentYoutuBe,
      },
    });

    const statusSpy = vi.spyOn(coursesStore, "asyncSetIsContentStatus").mockImplementation(() => Promise.resolve());
    const toggleBtn = wrapper.find('[data-testid="toggle-finished-btn"]');
    await toggleBtn.trigger("click");

    expect(statusSpy).toHaveBeenCalledWith(11, 0);
  });

  it("should redirect back to course detail if content is not found", async () => {
    const { coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 999 },
      preloadedState: {
        profile: mockProfile,
        content: null,
      },
    });

    coursesStore.setIsContent(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(mockGoto).toHaveBeenCalledWith("/courses/1");
  });

  it("should reload content when status change completes", async () => {
    const { coursesStore } = renderWithProviders(ContentPage, {
      props: { courseId: 1, contentId: 10 },
      preloadedState: {
        profile: mockProfile,
        content: mockContentWithVideo,
      },
    });

    const fetchSpy = vi.spyOn(coursesStore, "asyncSetContent").mockImplementation(() => Promise.resolve());

    coursesStore.setIsContentStatusChanged(true);
    coursesStore.setIsContentStatusChange(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchSpy).toHaveBeenCalledWith(10);
  });
});
