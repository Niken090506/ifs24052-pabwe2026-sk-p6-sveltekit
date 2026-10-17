import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailPage from "./DetailPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import { coursesStore } from "../states/coursesStore";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { mockGoto } from "../../../setupTests";

describe("DetailPage", () => {
  const mockOwnerProfile = { id: 1, name: "Owner User", email: "owner@delcom.org" };
  const mockStudentProfile = { id: 2, name: "Student User", email: "student@delcom.org" };
  const mockVisitorProfile = { id: 3, name: "Visitor User", email: "visitor@delcom.org" };

  const mockCourse = {
    id: 1,
    user_id: 1,
    title: "SvelteKit 3 Mastery",
    description: "Pelajari SvelteKit secara komprehensif",
    cover: "https://example.com/cover.jpg",
    average_rating: 4.9,
    created_at: "2026-03-01T00:00:00Z",
    students: [
      { id: 2, user_id: 2, name: "Student User", email: "student@delcom.org" },
    ],
    ratings: [{ user_id: 2, rating: 5 }],
    contents: [
      {
        id: 10,
        course_id: 1,
        title: "Pengantar SvelteKit",
        youtube_url: "https://youtube.com/watch?v=123",
        content: "Materi satu",
        is_finished: 1,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());
  });

  it("should show loader when profile or course is null", () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: null,
      },
    });

    expect(wrapper.text()).toContain("Memuat detail kursus...");
  });

  it("should render owner interface when current user is course owner", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: mockCourse,
      },
    });

    expect(wrapper.text()).toContain("SvelteKit 3 Mastery");
    expect(wrapper.text()).toContain("Pemilik Kursus");
    expect(wrapper.find('[data-testid="edit-cover-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="edit-course-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="delete-course-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="add-content-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="edit-content-btn-10"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="delete-content-btn-10"]').exists()).toBe(true);
  });

  it("should open edit cover, edit course, and content modals for owner", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: mockCourse,
      },
    });

    // 1. Cover modal
    const coverBtn = wrapper.find('[data-testid="edit-cover-btn"]');
    await coverBtn.trigger("click");
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);

    // 2. Edit course modal
    const editBtn = wrapper.find('[data-testid="edit-course-btn"]');
    await editBtn.trigger("click");
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(true);

    // 3. Add content modal
    const addContentBtn = wrapper.find('[data-testid="add-content-btn"]');
    await addContentBtn.trigger("click");
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);

    // 4. Edit content modal
    const editContentBtn = wrapper.find('[data-testid="edit-content-btn-10"]');
    await editContentBtn.trigger("click");
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
  });

  it("should delete course on confirmation", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);

    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: mockCourse,
      },
    });

    const deleteSpy = vi.spyOn(coursesStore, "asyncSetIsCourseDelete").mockImplementation(() => Promise.resolve());
    const deleteBtn = wrapper.find('[data-testid="delete-course-btn"]');
    await deleteBtn.trigger("click");

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should delete content on confirmation", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);

    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: mockCourse,
      },
    });

    const deleteContentSpy = vi.spyOn(coursesStore, "asyncSetIsContentDelete").mockImplementation(() => Promise.resolve());
    const delContentBtn = wrapper.find('[data-testid="delete-content-btn-10"]');
    await delContentBtn.trigger("click");

    expect(deleteContentSpy).toHaveBeenCalledWith(1, 10);
  });

  it("should render student interface with rating and leave button", async () => {
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockStudentProfile,
        course: mockCourse,
      },
    });

    expect(wrapper.text()).toContain("Peserta Terdaftar");
    expect(wrapper.find('[data-testid="leave-course-btn"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="submit-rating-btn"]').exists()).toBe(true);

    // Submit rating
    const ratingSpy = vi.spyOn(coursesStore, "asyncSetIsRatingAdd").mockImplementation(() => Promise.resolve());
    const selectRating = wrapper.find('[data-testid="select-rating"]');
    await selectRating.setValue("4");
    const submitRatingBtn = wrapper.find('[data-testid="submit-rating-btn"]');
    await submitRatingBtn.trigger("click");

    expect(ratingSpy).toHaveBeenCalledWith(1, 4);

    // Leave course
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({ isConfirmed: true } as any);
    const leaveSpy = vi.spyOn(coursesStore, "asyncSetIsStudentUnregister").mockImplementation(() => Promise.resolve());
    const leaveBtn = wrapper.find('[data-testid="leave-course-btn"]');
    await leaveBtn.trigger("click");

    expect(leaveSpy).toHaveBeenCalledWith(1);
  });

  it("should render visitor interface with enroll button", async () => {
    const { wrapper, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockVisitorProfile,
        course: mockCourse,
      },
    });

    const enrollBtn = wrapper.find('[data-testid="enroll-course-btn"]');
    expect(enrollBtn.exists()).toBe(true);

    const enrollSpy = vi.spyOn(coursesStore, "asyncSetIsStudentRegister").mockImplementation(() => Promise.resolve());
    await enrollBtn.trigger("click");

    expect(enrollSpy).toHaveBeenCalledWith(1);
  });

  it("should redirect to / if course is deleted or not found", async () => {
    const { coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: null,
      },
    });

    coursesStore.setIsCourse(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockGoto).toHaveBeenCalledWith("/");

    coursesStore.setIsCourseDeleted(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(mockGoto).toHaveBeenCalledWith("/");
  });

  it("should reload course when student registered, unregistered, or rating added", async () => {
    const { coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: mockCourse,
      },
    });

    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());

    coursesStore.setIsStudentRegistered(true);
    coursesStore.setIsStudentRegister(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(fetchSpy).toHaveBeenCalledWith(1);

    coursesStore.setIsStudentUnregistered(true);
    coursesStore.setIsStudentUnregister(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(fetchSpy).toHaveBeenCalledWith(1);

    coursesStore.setIsRatingAdded(true);
    coursesStore.setIsRatingAdd(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(fetchSpy).toHaveBeenCalledWith(1);

    coursesStore.setIsContentDeleted(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(fetchSpy).toHaveBeenCalledWith(1);
  });

  it("should re-fetch course when courseId prop changes", async () => {
    const { rerender, coursesStore } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: mockCourse,
      },
    });

    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());
    await rerender({ courseId: 2 });
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchSpy).toHaveBeenCalledWith(2);
  });

  it("should close modals via their close callbacks", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: mockCourse,
      },
    });

    // Open & close edit cover modal
    const coverBtn = wrapper.find('[data-testid="edit-cover-btn"]');
    await coverBtn.trigger("click");
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
    const closeCoverBtn = wrapper.find('[data-testid="close-change-cover-modal-btn"]');
    await closeCoverBtn.trigger("click");
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(false);

    // Open & close edit course modal
    const editBtn = wrapper.find('[data-testid="edit-course-btn"]');
    await editBtn.trigger("click");
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(true);
    const closeEditBtn = wrapper.find('[data-testid="close-change-course-modal-btn"]');
    await closeEditBtn.trigger("click");
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(false);

    // Open & close content modal
    const addContentBtn = wrapper.find('[data-testid="add-content-btn"]');
    await addContentBtn.trigger("click");
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
    const closeContentBtn = wrapper.find('[data-testid="close-content-modal-btn"]');
    await closeContentBtn.trigger("click");
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(false);
  });

  it("should render empty contents and student with null name/email", () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { courseId: 1 },
      preloadedState: {
        profile: mockOwnerProfile,
        course: {
          ...mockCourse,
          contents: [],
          students: [{ id: 99, user_id: 99, name: null, email: null }],
        },
      },
    });

    expect(wrapper.find('[data-testid="empty-contents"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Peserta");
  });
});
