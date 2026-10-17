import { describe, it, expect, vi, beforeEach } from "vitest";
import RootLayout from "./routes/+layout.svelte";
import { ssr } from "./routes/+layout";
import RootPage from "./routes/+page.svelte";
import DashboardPageWrapper from "./routes/dashboard/+page.svelte";
import RootError from "./routes/+error.svelte";
import AuthLayout from "./routes/auth/+layout.svelte";
import LoginPageWrapper from "./routes/auth/login/+page.svelte";
import RegisterPageWrapper from "./routes/auth/register/+page.svelte";
import ProfilePageWrapper from "./routes/profile/+page.svelte";
import CourseDetailPageWrapper from "./routes/courses/[courseId]/+page.svelte";
import CourseContentPageWrapper from "./routes/courses/[courseId]/contents/[contentId]/+page.svelte";
import CreateCoursePageWrapper from "./routes/courses/create/+page.svelte";
import EditCoursePageWrapper from "./routes/courses/edit/+page.svelte";
import UsersPageWrapper from "./routes/users/+page.svelte";
import { renderWithProviders } from "./test-utils";
import { mockPageStore, updateMockPage } from "./setupTests";
import apiHelper from "./helpers/apiHelper";
import * as toolsHelper from "./helpers/toolsHelper";
import { coursesStore } from "./features/courses/states/coursesStore";
import { usersStore } from "./features/users/states/usersStore";

describe("SvelteKit Routes and Layouts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateMockPage({
      url: new URL("http://localhost/"),
      params: { courseId: "1", contentId: "10" },
      route: { id: "/" },
      status: 200,
      error: null,
      data: {},
      form: null,
    });
  });

  it("should verify ssr is true in +layout.ts", () => {
    expect(ssr).toBe(true);
  });

  it("should render RootLayout for non-auth route using CourseLayout", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const { wrapper } = renderWithProviders(RootLayout, {
      preloadedState: {
        profile: { id: 1, name: "Logged User", email: "user@del.org" },
      },
    });

    expect(wrapper.text()).toContain("Delcom Courses");
  });

  it("should render RootLayout for /auth route directly", async () => {
    const { wrapper } = renderWithProviders(RootLayout, { route: "/auth/login" });
    expect(wrapper.text()).not.toContain("Delcom Courses");
  });

  it("should dynamically switch layout between non-auth and auth route on navigation", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const { wrapper } = renderWithProviders(RootLayout, {
      route: "/",
      preloadedState: {
        profile: { id: 1, name: "Logged User", email: "user@del.org" },
      },
    });

    expect(wrapper.text()).toContain("Delcom Courses");

    // Navigate to /auth/login (simulating logout)
    updateMockPage({ url: new URL("http://localhost:3000/auth/login") });
    await new Promise((r) => setTimeout(r, 0));
    expect(wrapper.text()).not.toContain("Delcom Courses");

    // Navigate back to / (simulating login)
    usersStore.setProfile({ id: 1, name: "Logged User", email: "user@del.org" });
    updateMockPage({ url: new URL("http://localhost:3000/") });
    await new Promise((r) => setTimeout(r, 20));
    expect(wrapper.text()).toContain("Delcom Courses");
  });

  it("should render RootPage (+page.svelte)", () => {
    const { wrapper } = renderWithProviders(RootPage, {
      preloadedState: {
        profile: { id: 1, name: "Logged User" },
        courses: [],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("should render DashboardPageWrapper (routes/dashboard/+page.svelte)", () => {
    const { wrapper } = renderWithProviders(DashboardPageWrapper, {
      preloadedState: {
        profile: { id: 1, name: "Logged User" },
        courses: [],
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("should render RootError (+error.svelte)", () => {
    const { wrapper } = renderWithProviders(RootError);
    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Halaman Tidak Ditemukan");
  });

  it("should render AuthLayout (routes/auth/+layout.svelte)", () => {
    const { wrapper } = renderWithProviders(AuthLayout);
    expect(wrapper.text()).toContain("Delcom Courses");
  });

  it("should render LoginPageWrapper (routes/auth/login/+page.svelte)", () => {
    const { wrapper } = renderWithProviders(LoginPageWrapper);
    expect(wrapper.text()).toContain("Masuk Sekarang");
  });

  it("should render RegisterPageWrapper (routes/auth/register/+page.svelte)", () => {
    const { wrapper } = renderWithProviders(RegisterPageWrapper);
    expect(wrapper.text()).toContain("Daftar Sekarang");
  });

  it("should render ProfilePageWrapper (routes/profile/+page.svelte)", () => {
    const { wrapper } = renderWithProviders(ProfilePageWrapper, {
      preloadedState: {
        profile: { id: 1, name: "Logged User", email: "user@del.org" },
      },
    });
    expect(wrapper.text()).toContain("Profil Akun");
  });

  it("should render CourseDetailPageWrapper (routes/courses/[courseId]/+page.svelte)", () => {
    const { wrapper } = renderWithProviders(CourseDetailPageWrapper, {
      preloadedState: {
        profile: { id: 1, name: "Logged User" },
        course: { id: 1, user_id: 1, title: "Detail Test", description: "Desc" },
      },
    });
    expect(wrapper.text()).toContain("Detail Test");
  });

  it("should render CourseContentPageWrapper (routes/courses/[courseId]/contents/[contentId]/+page.svelte)", () => {
    const { wrapper } = renderWithProviders(CourseContentPageWrapper, {
      preloadedState: {
        profile: { id: 1, name: "Logged User" },
        content: { id: 10, course_id: 1, title: "Materi Test", content: "Content Desc" },
      },
    });
    expect(wrapper.text()).toContain("Materi Test");
  });

  it("should render UsersPageWrapper (routes/users/+page.svelte)", () => {
    const { wrapper } = renderWithProviders(UsersPageWrapper, {
      preloadedState: {
        users: [{ id: 1, name: "User Satu", email: "satu@del.org" }],
      },
    });
    expect(wrapper.text()).toContain("Semua Pengguna");
  });

  it("should render CreateCoursePageWrapper and handle form interactions", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const { wrapper } = renderWithProviders(CreateCoursePageWrapper);
    expect(wrapper.text()).toContain("Tambah Kursus Baru");

    // Click submit without title
    const submitBtn = wrapper.find('[data-testid="submit-create-course-btn"]');
    await submitBtn.trigger("click");
    expect(errorSpy).toHaveBeenCalledWith("Judul kursus tidak boleh kosong");

    // Fill title but empty description
    const titleInput = wrapper.find('[data-testid="create-course-title-input"]');
    await titleInput.setValue("Judul Baru");
    await submitBtn.trigger("click");
    expect(errorSpy).toHaveBeenCalledWith("Deskripsi kursus tidak boleh kosong");

    // Fill description and save
    const saveSpy = vi.spyOn(coursesStore, "asyncSetIsCourseAdd").mockImplementation(async () => {});
    const descTextarea = wrapper.find('[data-testid="create-course-desc-textarea"]');
    await descTextarea.setValue("Deskripsi Baru");
    await submitBtn.trigger("click");
    expect(saveSpy).toHaveBeenCalledWith("Judul Baru", "Deskripsi Baru");

    // Trigger store response with false and true
    coursesStore.setIsCourseAdded(false);
    coursesStore.setIsCourseAdd(true);
    await new Promise((r) => setTimeout(r, 10));

    coursesStore.setIsCourseAdded(true);
    coursesStore.setIsCourseAdd(true);
    await new Promise((r) => setTimeout(r, 10));

    // Cancel and back button
    const backBtn = wrapper.find('[data-testid="back-to-courses-btn"]');
    await backBtn.trigger("click");
    const cancelBtn = wrapper.find('[data-testid="cancel-create-course-btn"]');
    await cancelBtn.trigger("click");
  });

  it("should render EditCoursePageWrapper and handle form interactions", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
    const { wrapper } = renderWithProviders(EditCoursePageWrapper, {
      preloadedState: {
        course: { id: 1, title: "", description: "", user_id: 1 },
      },
    });
    expect(wrapper.text()).toContain("Ubah Informasi Kursus");

    // Click submit with empty data
    const submitBtn = wrapper.find('[data-testid="submit-edit-course-btn"]');
    await submitBtn.trigger("click");
    expect(errorSpy).toHaveBeenCalledWith("Judul kursus tidak boleh kosong");

    // Empty description
    const titleInput = wrapper.find('[data-testid="edit-course-title-input"]');
    await titleInput.setValue("Judul Diubah");
    await submitBtn.trigger("click");
    expect(errorSpy).toHaveBeenCalledWith("Deskripsi kursus tidak boleh kosong");

    // Click submit with valid data
    const saveSpy = vi.spyOn(coursesStore, "asyncSetIsCourseChange").mockImplementation(async () => {});
    const descTextarea = wrapper.find('[data-testid="edit-course-desc-textarea"]');
    await descTextarea.setValue("Deskripsi Baru");
    await submitBtn.trigger("click");
    expect(saveSpy).toHaveBeenCalledWith(1, "Judul Diubah", "Deskripsi Baru");

    // Store response with isCourseChanged = false
    coursesStore.setIsCourseChanged(false);
    coursesStore.setIsCourseChange(true);
    await new Promise((r) => setTimeout(r, 10));

    // Store response with course present
    coursesStore.setCourse({ id: 1, title: "Title", description: "Desc", user_id: 1 });
    coursesStore.setIsCourseChanged(true);
    coursesStore.setIsCourseChange(true);
    await new Promise((r) => setTimeout(r, 10));

    // Store response with course = null
    coursesStore.setCourse(null);
    coursesStore.setIsCourseChanged(true);
    coursesStore.setIsCourseChange(true);
    await new Promise((r) => setTimeout(r, 10));

    // Cancel and back button
    const backBtn = wrapper.find('[data-testid="back-from-edit-btn"]');
    await backBtn.trigger("click");
    const cancelBtn = wrapper.find('[data-testid="cancel-edit-course-btn"]');
    await cancelBtn.trigger("click");
  });

  it("should handle EditCoursePageWrapper when no course is in store", async () => {
    const { wrapper } = renderWithProviders(EditCoursePageWrapper, {
      preloadedState: {
        course: null,
      },
    });
    const titleInput = wrapper.find('[data-testid="edit-course-title-input"]');
    const descTextarea = wrapper.find('[data-testid="edit-course-desc-textarea"]');
    await titleInput.setValue("Judul");
    await descTextarea.setValue("Deskripsi");
    const submitBtn = wrapper.find('[data-testid="submit-edit-course-btn"]');
    await submitBtn.trigger("click");
  });
});
