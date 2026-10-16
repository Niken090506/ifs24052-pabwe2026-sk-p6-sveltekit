import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.svelte";
import { renderWithProviders, setupMockStores } from "../../../test-utils";
import { coursesStore } from "../states/coursesStore";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("HomePage", () => {
  const mockProfile = { id: 1, name: "Owner User", email: "owner@delcom.org" };
  const mockCourses = [
    {
      id: 1,
      user_id: 1,
      title: "Course Milik Saya",
      description: "Deskripsi kursus saya",
      cover: "https://example.com/cover.jpg",
      average_rating: 4.8,
      students: [{ id: 10 }],
    },
    {
      id: 2,
      user_id: 2,
      title: "Course Lain",
      description: "Deskripsi kursus orang lain",
      cover: null,
      average_rating: 0,
      students: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetCourses").mockImplementation(() => Promise.resolve());
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);
  });

  it("should not render if profile is null", () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: { profile: null },
    });
    expect(wrapper.find('[data-testid="add-course-btn"]').exists()).toBe(false);
  });

  it("should render courses list and owner badges", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Semua Kursus");
    expect(wrapper.text()).toContain("Course Milik Saya");
    expect(wrapper.text()).toContain("Milik Saya");
    expect(wrapper.text()).toContain("Course Lain");
  });

  it("should display loading indicator while loading courses", async () => {
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: [],
      },
    });

    vi.spyOn(coursesStore, "asyncSetCourses").mockReturnValue(new Promise(() => {}));
    const filterSelect = wrapper.find('[data-testid="filter-course-select"]');
    await filterSelect.setValue("1");

    expect(wrapper.text()).toContain("Memuat daftar kursus...");
  });

  it("should filter courses with search input", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const searchInput = wrapper.find('[data-testid="search-course-input"]');
    await searchInput.setValue("Milik Saya");

    expect(wrapper.text()).toContain("Course Milik Saya");
    expect(wrapper.text()).not.toContain("Course Lain");

    // Search by description
    await searchInput.setValue("orang lain");
    expect(wrapper.text()).toContain("Course Lain");
  });

  it("should handle search with null title and description", async () => {
    vi.spyOn(toolsHelper, "formatDate").mockReturnValue("-");
    const { coursesStore } = setupMockStores({
      profile: mockProfile,
      courses: [{ id: 99, user_id: 1, title: null, description: null }],
    });
    vi.spyOn(coursesStore, "asyncSetCourses").mockResolvedValue();

    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: [{ id: 99, user_id: 1, title: null, description: null }],
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const searchInput = wrapper.find('[data-testid="search-course-input"]');
    await searchInput.setValue("xyz");
    expect(wrapper.find('[data-testid="empty-courses"]').exists()).toBe(true);
  });

  it("should filter courses by is_me selection", async () => {
    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourses").mockImplementation(() => Promise.resolve());
    const filterSelect = wrapper.find('[data-testid="filter-course-select"]');
    await filterSelect.setValue("1");

    expect(fetchSpy).toHaveBeenCalledWith("1");
  });

  it("should render empty state when courses array is empty", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: [],
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.find('[data-testid="empty-courses"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Belum Ada Kursus");
  });

  it("should open and close AddModal on add button click", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const addBtn = wrapper.find('[data-testid="add-course-btn"]');
    await addBtn.trigger("click");

    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(true);

    const closeBtn = wrapper.find('[data-testid="close-add-course-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(false);
  });

  it("should handle single course delete with confirm dialog", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDelete").mockImplementation(() => Promise.resolve());

    const deleteBtn = wrapper.find('[data-testid="delete-course-btn-1"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should cancel single course delete if confirm dialog is rejected", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDelete").mockImplementation(() => Promise.resolve());

    const deleteBtn = wrapper.find('[data-testid="delete-course-btn-1"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should handle delete all courses with confirm dialog", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteAllSpy = vi.spyOn(coursesStore, "asyncSetIsCoursesDelete").mockImplementation(() => Promise.resolve());

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-courses-btn"]');
    await deleteAllBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(deleteAllSpy).toHaveBeenCalled();
  });

  it("should cancel delete all courses if confirm dialog is rejected", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: false } as any);

    const { wrapper, coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const deleteAllSpy = vi.spyOn(coursesStore, "asyncSetIsCoursesDelete").mockImplementation(() => Promise.resolve());

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-courses-btn"]');
    await deleteAllBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(deleteAllSpy).not.toHaveBeenCalled();
  });

  it("should reload courses when isCourseDeleted flag triggers", async () => {
    const { coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourses").mockResolvedValue();

    coursesStore.setIsCourseDeleted(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should reload courses when isCoursesDeleted flag triggers", async () => {
    const { coursesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: mockCourses,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourses").mockResolvedValue();

    coursesStore.setIsCoursesDeleted(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it("should handle null courses store gracefully", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        courses: null,
      },
    });

    await new Promise((r) => setTimeout(r, 20));

    expect(wrapper.text()).toContain("Belum Ada Kursus");
  });
});
