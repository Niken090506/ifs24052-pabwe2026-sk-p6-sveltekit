import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeCoverModal from "./ChangeCoverModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ChangeCoverModal", () => {
  const mockCourse = {
    id: 1,
    title: "Course Test",
    cover: "https://example.com/cover.jpg",
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    (global as any).URL.createObjectURL = vi.fn(() => "blob:http://localhost/dummy-preview");
  });

  it("should not render when show is false or course is null", () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: false, course: mockCourse },
    });
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(false);

    const { wrapper: wrapper2 } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: null },
    });
    expect(wrapper2.find('[data-testid="change-cover-modal"]').exists()).toBe(false);
  });

  it("should render when show is true and course is present", () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: mockCourse },
    });
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
  });

  it("should handle close button and cancel button", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: mockCourse, onClose: closeSpy },
    });

    const closeBtn = wrapper.find('[data-testid="close-change-cover-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalled();

    const cancelBtn = wrapper.find('[data-testid="cancel-change-cover-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should show error when submitting without choosing a file", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: mockCourse },
    });

    const uploadBtn = wrapper.find('[data-testid="upload-cover-btn"]');
    await uploadBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Silakan pilih file cover terlebih dahulu!");
  });

  it("should validate invalid file type and file size limit", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: mockCourse },
    });

    const fileInput = wrapper.find('[data-testid="cover-file-input"]');

    // 1. Non-image file
    const invalidFile = new File(["dummy"], "test.pdf", { type: "application/pdf" });
    Object.defineProperty(fileInput.element, "files", {
      value: [invalidFile],
      configurable: true,
    });
    await fileInput.trigger("change");
    expect(errorSpy).toHaveBeenCalledWith("Pilih file gambar (JPG/PNG)!");

    // 2. Oversized file (> 1MB)
    const largeFile = new File([new ArrayBuffer(2 * 1024 * 1024)], "large.jpg", { type: "image/jpeg" });
    Object.defineProperty(fileInput.element, "files", {
      value: [largeFile],
      configurable: true,
    });
    await fileInput.trigger("change");
    expect(errorSpy).toHaveBeenCalledWith("Ukuran gambar maksimal 1MB!");
  });

  it("should preview and upload valid file successfully", async () => {
    const closeSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, course: mockCourse, onClose: closeSpy },
    });

    const uploadActionSpy = vi.spyOn(coursesStore, "asyncSetIsCourseChangeCover").mockImplementation(() => Promise.resolve());
    const fetchCourseSpy = vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());

    const validFile = new File(["dummy image"], "cover.png", { type: "image/png" });
    const fileInput = wrapper.find('[data-testid="cover-file-input"]');
    Object.defineProperty(fileInput.element, "files", {
      value: [validFile],
      configurable: true,
    });
    await fileInput.trigger("change");

    expect(wrapper.find('[data-testid="cover-preview-img"]').exists()).toBe(true);

    const uploadBtn = wrapper.find('[data-testid="upload-cover-btn"]');
    await uploadBtn.trigger("click");

    expect(uploadActionSpy).toHaveBeenCalledWith(1, validFile);

    // Trigger success
    coursesStore.setIsCourseChangedCover(true);
    coursesStore.setIsCourseChangeCover(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchCourseSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });
});
