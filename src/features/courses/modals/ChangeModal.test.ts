import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeModal from "./ChangeModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ChangeModal", () => {
  const mockCourse = {
    id: 1,
    title: "Course Original",
    description: "Original Description",
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false or course is null", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: false, course: mockCourse },
    });
    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(false);

    const { wrapper: wrapper2 } = renderWithProviders(ChangeModal, {
      props: { show: true, course: null },
    });
    expect(wrapper2.find('[data-testid="change-course-modal"]').exists()).toBe(false);
  });

  it("should render when show is true and course is provided", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: mockCourse },
    });

    expect(wrapper.find('[data-testid="change-course-modal"]').exists()).toBe(true);
    const titleInput = wrapper.find('[data-testid="edit-course-title-input"]');
    expect((titleInput.element as HTMLInputElement).value).toBe("Course Original");
  });

  it("should close via close and cancel buttons", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: mockCourse, onClose: closeSpy },
    });

    const closeBtn = wrapper.find('[data-testid="close-change-course-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalled();

    const cancelBtn = wrapper.find('[data-testid="cancel-change-course-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should validate empty title", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: mockCourse },
    });

    const titleInput = wrapper.find('[data-testid="edit-course-title-input"]');
    await titleInput.setValue("");

    const saveBtn = wrapper.find('[data-testid="save-change-course-btn"]');
    await saveBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Judul kursus tidak boleh kosong");
  });

  it("should validate empty description", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, course: mockCourse },
    });

    const descTextarea = wrapper.find('[data-testid="edit-course-description-textarea"]');
    await descTextarea.setValue("");

    const saveBtn = wrapper.find('[data-testid="save-change-course-btn"]');
    await saveBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi kursus tidak boleh kosong");
  });

  it("should call asyncSetIsCourseChange and update course on success", async () => {
    const closeSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, course: mockCourse, onClose: closeSpy },
    });

    const changeSpy = vi.spyOn(coursesStore, "asyncSetIsCourseChange").mockImplementation(() => Promise.resolve());
    const fetchCourseSpy = vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());

    const titleInput = wrapper.find('[data-testid="edit-course-title-input"]');
    await titleInput.setValue("Updated Title");

    const descTextarea = wrapper.find('[data-testid="edit-course-description-textarea"]');
    await descTextarea.setValue("Updated Description");

    const saveBtn = wrapper.find('[data-testid="save-change-course-btn"]');
    await saveBtn.trigger("click");

    expect(changeSpy).toHaveBeenCalledWith(1, "Updated Title", "Updated Description");

    coursesStore.setIsCourseChanged(true);
    coursesStore.setIsCourseChange(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchCourseSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });
});
