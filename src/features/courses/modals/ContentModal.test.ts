import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentModal from "./ContentModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ContentModal", () => {
  const mockContent = {
    id: 10,
    course_id: 1,
    title: "Materi SvelteKit",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: "Penjelasan materi SvelteKit",
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false or courseId is null", () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: false, courseId: 1 },
    });
    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(false);

    const { wrapper: wrapper2 } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: null },
    });
    expect(wrapper2.find('[data-testid="content-modal"]').exists()).toBe(false);
  });

  it("should render when show is true and courseId is provided for add mode", () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: null },
    });

    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Tambah Materi Baru");
  });

  it("should render and prefill fields for edit mode", () => {
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: mockContent },
    });

    expect(wrapper.find('[data-testid="content-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Ubah Materi Pembelajaran");

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    expect((titleInput.element as HTMLInputElement).value).toBe("Materi SvelteKit");

    const ytInput = wrapper.find('[data-testid="content-youtube-input"]');
    expect((ytInput.element as HTMLInputElement).value).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  it("should close via close and cancel buttons", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, onClose: closeSpy },
    });

    const closeBtn = wrapper.find('[data-testid="close-content-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalled();

    const cancelBtn = wrapper.find('[data-testid="cancel-content-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should validate empty title", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1 },
    });

    const saveBtn = wrapper.find('[data-testid="save-content-btn"]');
    await saveBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Judul materi tidak boleh kosong");
  });

  it("should validate invalid youtube URL", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1 },
    });

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Judul");

    const ytInput = wrapper.find('[data-testid="content-youtube-input"]');
    await ytInput.setValue("invalid-url-string");

    const saveBtn = wrapper.find('[data-testid="save-content-btn"]');
    await saveBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Alamat tautan video tidak valid!");
  });

  it("should validate empty body content", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

    const { wrapper } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1 },
    });

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Judul");

    const saveBtn = wrapper.find('[data-testid="save-content-btn"]');
    await saveBtn.trigger("click");

    expect(errorSpy).toHaveBeenCalledWith("Isi materi pembelajaran tidak boleh kosong");
  });

  it("should call asyncSetIsContentAdd in add mode and handle success", async () => {
    const closeSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: null, onClose: closeSpy },
    });

    const addSpy = vi.spyOn(coursesStore, "asyncSetIsContentAdd").mockImplementation(() => Promise.resolve());
    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Materi 1");

    const ytInput = wrapper.find('[data-testid="content-youtube-input"]');
    await ytInput.setValue("https://youtube.com/watch?v=123");

    const bodyTextarea = wrapper.find('[data-testid="content-body-textarea"]');
    await bodyTextarea.setValue("Isi Markdown Materi");

    const saveBtn = wrapper.find('[data-testid="save-content-btn"]');
    await saveBtn.trigger("click");

    expect(addSpy).toHaveBeenCalledWith(1, "Materi 1", "https://youtube.com/watch?v=123", "Isi Markdown Materi");

    coursesStore.setIsContentAdded(true);
    coursesStore.setIsContentAdd(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should call asyncSetIsContentChange in edit mode and handle success", async () => {
    const closeSpy = vi.fn();
    const { wrapper, coursesStore } = renderWithProviders(ContentModal, {
      props: { show: true, courseId: 1, content: mockContent, onClose: closeSpy },
    });

    const changeSpy = vi.spyOn(coursesStore, "asyncSetIsContentChange").mockImplementation(() => Promise.resolve());
    const fetchSpy = vi.spyOn(coursesStore, "asyncSetCourse").mockImplementation(() => Promise.resolve());

    const titleInput = wrapper.find('[data-testid="content-title-input"]');
    await titleInput.setValue("Materi Diubah");

    const saveBtn = wrapper.find('[data-testid="save-content-btn"]');
    await saveBtn.trigger("click");

    expect(changeSpy).toHaveBeenCalledWith(1, 10, "Materi Diubah", mockContent.youtube_url, mockContent.content);

    coursesStore.setIsContentChanged(true);
    coursesStore.setIsContentChange(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(fetchSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });
});
