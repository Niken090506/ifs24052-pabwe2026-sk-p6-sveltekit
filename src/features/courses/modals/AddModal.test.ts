import { describe, it, expect, vi, beforeEach } from "vitest";
import AddModal from "./AddModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: false },
    });
    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(false);
  });

  it("should render when show is true and handle close button", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true, onClose: closeSpy },
    });

    expect(wrapper.find('[data-testid="add-course-modal"]').exists()).toBe(true);

    const closeBtn = wrapper.find('[data-testid="close-add-course-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should close via cancel button", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true, onClose: closeSpy },
    });

    const cancelBtn = wrapper.find('[data-testid="cancel-add-course-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should validate empty title", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const saveBtn = wrapper.find('[data-testid="save-add-course-btn"]');
    await saveBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Judul kursus tidak boleh kosong");
  });

  it("should validate empty description", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const titleInput = wrapper.find('[data-testid="course-title-input"]');
    await titleInput.setValue("Judul Kursus Baru");

    const saveBtn = wrapper.find('[data-testid="save-add-course-btn"]');
    await saveBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi kursus tidak boleh kosong");
  });

  it("should call asyncSetIsCourseAdd when inputs are valid and reset state on success", async () => {
    const closeSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(AddModal, {
      props: { show: true, onClose: closeSpy },
    });

    const addSpy = vi.spyOn(coursesStore, "asyncSetIsCourseAdd").mockImplementation(() => Promise.resolve());
    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourses").mockImplementation(() => Promise.resolve());

    const titleInput = wrapper.find('[data-testid="course-title-input"]');
    await titleInput.setValue("Judul Kursus Baru");

    const descTextarea = wrapper.find('[data-testid="course-description-textarea"]');
    await descTextarea.setValue("Deskripsi Kursus Lengkap");

    const saveBtn = wrapper.find('[data-testid="save-add-course-btn"]');
    await saveBtn.trigger("click");

    expect(addSpy).toHaveBeenCalledWith("Judul Kursus Baru", "Deskripsi Kursus Lengkap");

    // Simulate store success trigger
    coursesStore.setIsCourseAdded(true);
    coursesStore.setIsCourseAdd(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle close without onClose callback", async () => {
    const { wrapper } = renderWithProviders(AddModal, {
      props: { show: true },
    });

    const closeBtn = wrapper.find('[data-testid="close-add-course-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });
});
