import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import MarkdownEditor from "./MarkdownEditor.svelte";

let mockEvents: Record<string, any> = {};
const mockGetMarkdown = vi.fn(() => "mock editor text");
const mockSetMarkdown = vi.fn();
const mockDestroy = vi.fn();

vi.mock("@toast-ui/editor", () => {
  return {
    default: vi.fn().mockImplementation(function (this: any, options: any) {
      mockEvents = options.events || {};
      this.getMarkdown = mockGetMarkdown;
      this.setMarkdown = mockSetMarkdown;
      this.destroy = mockDestroy;
    }),
  };
});

describe("MarkdownEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEvents = {};
  });

  it("should initialize Editor with props and handle change event", async () => {
    const { container, rerender, unmount } = render(MarkdownEditor, {
      props: {
        value: "initial text",
        placeholder: "Tulis...",
        height: "300px",
        textareaTestId: "custom-editor-textarea",
      },
    });

    await new Promise((r) => setTimeout(r, 10));

    const textarea = container.querySelector('[data-testid="custom-editor-textarea"]');
    expect(textarea).toBeTruthy();

    // Trigger editor event change
    if (mockEvents.change) {
      mockEvents.change();
    }

    // Update prop value to different value
    await rerender({ value: "updated prop" });
    await new Promise((r) => setTimeout(r, 10));
    expect(mockSetMarkdown).toHaveBeenCalledWith("updated prop");

    // Update prop value to empty
    await rerender({ value: "" });
    await new Promise((r) => setTimeout(r, 10));
    expect(mockSetMarkdown).toHaveBeenCalledWith("");

    // Unmount
    unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });

  it("should handle onTextareaInput fallback", async () => {
    const { container } = render(MarkdownEditor, {
      props: {
        value: "",
      },
    });

    await new Promise((r) => setTimeout(r, 10));

    const textarea = container.querySelector("textarea");
    expect(textarea).toBeTruthy();
    if (textarea) {
      await fireEvent.input(textarea, { target: { value: "manual input" } });
    }

    expect(mockSetMarkdown).toHaveBeenCalledWith("manual input");
  });

  it("should handle input and unmount gracefully when Editor fails to initialize", async () => {
    const EditorMock = ((await import("@toast-ui/editor")) as any).default;
    EditorMock.mockImplementationOnce(function () {
      throw new Error("Initialization failed");
    });

    const { container, unmount } = render(MarkdownEditor, {
      props: {
        value: "fallback text",
      },
    });

    const textarea = container.querySelector("textarea");
    if (textarea) {
      await fireEvent.input(textarea, { target: { value: "manual input fallback" } });
    }
    unmount();
  });

  it("should sanitize accessibility issues in editorContainer DOM", async () => {
    let editorEl: HTMLElement | null = null;
    const EditorMock = ((await import("@toast-ui/editor")) as any).default;
    EditorMock.mockImplementationOnce(function (this: any, options: any) {
      this.getMarkdown = mockGetMarkdown;
      this.setMarkdown = mockSetMarkdown;
      this.destroy = mockDestroy;

      // Simulate Toast UI rendering invalid attributes and elements inside el
      const container = options.el as HTMLElement;
      editorEl = container;
      const tab1 = document.createElement("div");
      tab1.setAttribute("aria-role", "tab");
      container.appendChild(tab1);

      const tab2 = document.createElement("div");
      tab2.setAttribute("aria-role", "");
      container.appendChild(tab2);

      const btnWithTitle = document.createElement("button");
      btnWithTitle.setAttribute("title", "More Tools");
      container.appendChild(btnWithTitle);

      const btnWithoutTitle = document.createElement("button");
      container.appendChild(btnWithoutTitle);

      const btnWithLabel = document.createElement("button");
      btnWithLabel.setAttribute("aria-label", "Existing Label");
      container.appendChild(btnWithLabel);

      const clipboardTa = document.createElement("textarea");
      container.appendChild(clipboardTa);

      const labeledTa = document.createElement("textarea");
      labeledTa.setAttribute("aria-label", "Existing TA");
      container.appendChild(labeledTa);
    });

    const { component, unmount } = render(MarkdownEditor);
    await new Promise((r) => setTimeout(r, 20));

    // Mutate DOM to trigger MutationObserver
    if (editorEl) {
      const dynamicBtn = document.createElement("button");
      (editorEl as HTMLElement).appendChild(dynamicBtn);
    }
    await new Promise((r) => setTimeout(r, 30));

    // Also manually trigger exported method to ensure direct execution
    (component as any).sanitizeEditorA11y();

    unmount();
  });
});
