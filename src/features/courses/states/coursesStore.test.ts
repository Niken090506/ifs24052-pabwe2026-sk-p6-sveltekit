import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCoursesStore, coursesStore } from "./coursesStore";
import courseApi from "../api/courseApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("coursesStore", () => {
  beforeEach(() => {
    coursesStore.reset();
    vi.restoreAllMocks();
  });

  it("should have correct default state", () => {
    const store = useCoursesStore();
    expect(store.courses).toEqual([]);
    expect(store.course).toBeNull();
    expect(store.content).toBeNull();
    expect(store.isCourse).toBe(false);
    expect(store.isCourseAdd).toBe(false);
    expect(store.isCourseAdded).toBe(false);
    expect(store.isCourseChange).toBe(false);
    expect(store.isCourseChanged).toBe(false);
    expect(store.isCourseChangeCover).toBe(false);
    expect(store.isCourseChangedCover).toBe(false);
    expect(store.isCourseDelete).toBe(false);
    expect(store.isCourseDeleted).toBe(false);
    expect(store.isCoursesDelete).toBe(false);
    expect(store.isCoursesDeleted).toBe(false);
    expect(store.isStudentRegister).toBe(false);
    expect(store.isStudentRegistered).toBe(false);
    expect(store.isStudentUnregister).toBe(false);
    expect(store.isStudentUnregistered).toBe(false);
    expect(store.isRatingAdd).toBe(false);
    expect(store.isRatingAdded).toBe(false);
    expect(store.isContent).toBe(false);
    expect(store.isContentAdd).toBe(false);
    expect(store.isContentAdded).toBe(false);
    expect(store.isContentChange).toBe(false);
    expect(store.isContentChanged).toBe(false);
    expect(store.isContentDelete).toBe(false);
    expect(store.isContentDeleted).toBe(false);
    expect(store.isContentStatusChange).toBe(false);
    expect(store.isContentStatusChanged).toBe(false);
  });

  it("should update state with setters and reset", () => {
    const store = useCoursesStore();
    store.setCourses([{ id: 1 } as any]);
    expect(store.courses).toEqual([{ id: 1 }]);

    store.setCourse({ id: 1 } as any);
    expect(store.course).toEqual({ id: 1 });

    store.setContent({ id: 2 } as any);
    expect(store.content).toEqual({ id: 2 });

    store.setIsCourse(true);
    expect(store.isCourse).toBe(true);

    store.setIsCourseAdd(true);
    expect(store.isCourseAdd).toBe(true);

    store.setIsCourseAdded(true);
    expect(store.isCourseAdded).toBe(true);

    store.setIsCourseChange(true);
    expect(store.isCourseChange).toBe(true);

    store.setIsCourseChanged(true);
    expect(store.isCourseChanged).toBe(true);

    store.setIsCourseChangeCover(true);
    expect(store.isCourseChangeCover).toBe(true);

    store.setIsCourseChangedCover(true);
    expect(store.isCourseChangedCover).toBe(true);

    store.setIsCourseDelete(true);
    expect(store.isCourseDelete).toBe(true);

    store.setIsCourseDeleted(true);
    expect(store.isCourseDeleted).toBe(true);

    store.setIsCoursesDelete(true);
    expect(store.isCoursesDelete).toBe(true);

    store.setIsCoursesDeleted(true);
    expect(store.isCoursesDeleted).toBe(true);

    store.setIsStudentRegister(true);
    expect(store.isStudentRegister).toBe(true);

    store.setIsStudentRegistered(true);
    expect(store.isStudentRegistered).toBe(true);

    store.setIsStudentUnregister(true);
    expect(store.isStudentUnregister).toBe(true);

    store.setIsStudentUnregistered(true);
    expect(store.isStudentUnregistered).toBe(true);

    store.setIsRatingAdd(true);
    expect(store.isRatingAdd).toBe(true);

    store.setIsRatingAdded(true);
    expect(store.isRatingAdded).toBe(true);

    store.setIsContent(true);
    expect(store.isContent).toBe(true);

    store.setIsContentAdd(true);
    expect(store.isContentAdd).toBe(true);

    store.setIsContentAdded(true);
    expect(store.isContentAdded).toBe(true);

    store.setIsContentChange(true);
    expect(store.isContentChange).toBe(true);

    store.setIsContentChanged(true);
    expect(store.isContentChanged).toBe(true);

    store.setIsContentDelete(true);
    expect(store.isContentDelete).toBe(true);

    store.setIsContentDeleted(true);
    expect(store.isContentDeleted).toBe(true);

    store.setIsContentStatusChange(true);
    expect(store.isContentStatusChange).toBe(true);

    store.setIsContentStatusChanged(true);
    expect(store.isContentStatusChanged).toBe(true);

    store.reset();
    expect(store.courses).toEqual([]);
    expect(store.isCourse).toBe(false);
  });

  describe("async actions", () => {
    it("asyncSetCourses handles success and failure", async () => {
      vi.spyOn(courseApi, "getCourses").mockResolvedValue([{ id: 1 } as any]);
      await coursesStore.asyncSetCourses();
      expect(coursesStore.courses).toEqual([{ id: 1 }]);

      vi.spyOn(courseApi, "getCourses").mockRejectedValue(new Error("err"));
      await coursesStore.asyncSetCourses();
      expect(coursesStore.courses).toEqual([]);
    });

    it("asyncSetCourse handles success and failure", async () => {
      vi.spyOn(courseApi, "getCourseById").mockResolvedValue({ id: 1 } as any);
      await coursesStore.asyncSetCourse(1);
      expect(coursesStore.course).toEqual({ id: 1 });
      expect(coursesStore.isCourse).toBe(true);

      vi.spyOn(courseApi, "getCourseById").mockRejectedValue(new Error("err"));
      await coursesStore.asyncSetCourse(1);
      expect(coursesStore.course).toBeNull();
      expect(coursesStore.isCourse).toBe(true);
    });

    it("asyncSetIsCourseAdd handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "postCourse").mockResolvedValue({ id: 1 } as any);
      await coursesStore.asyncSetIsCourseAdd("Title", "Desc");
      expect(coursesStore.isCourseAdded).toBe(true);
      expect(coursesStore.isCourseAdd).toBe(true);
      expect(successSpy).toHaveBeenCalled();

      vi.spyOn(courseApi, "postCourse").mockRejectedValue(new Error("Fail Add"));
      await coursesStore.asyncSetIsCourseAdd("Title", "Desc");
      expect(coursesStore.isCourseAdded).toBe(false);
      expect(coursesStore.isCourseAdd).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Fail Add");
    });

    it("asyncSetIsCourseChange handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "putCourse").mockResolvedValue("Berhasil");
      await coursesStore.asyncSetIsCourseChange(1, "Title", "Desc");
      expect(coursesStore.isCourseChanged).toBe(true);
      expect(coursesStore.isCourseChange).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Berhasil");

      vi.spyOn(courseApi, "putCourse").mockRejectedValue(new Error("Fail Put"));
      await coursesStore.asyncSetIsCourseChange(1, "Title", "Desc");
      expect(coursesStore.isCourseChanged).toBe(false);
      expect(coursesStore.isCourseChange).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Fail Put");
    });

    it("asyncSetIsCourseChangeCover handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "postCourseCover").mockResolvedValue("Cover changed");
      await coursesStore.asyncSetIsCourseChangeCover(1, new File([""], "c.jpg"));
      expect(coursesStore.isCourseChangedCover).toBe(true);
      expect(coursesStore.isCourseChangeCover).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Cover changed");

      vi.spyOn(courseApi, "postCourseCover").mockRejectedValue(new Error("Cover error"));
      await coursesStore.asyncSetIsCourseChangeCover(1, new File([""], "c.jpg"));
      expect(coursesStore.isCourseChangedCover).toBe(false);
      expect(coursesStore.isCourseChangeCover).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Cover error");
    });

    it("asyncSetIsCourseDelete handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "deleteCourse").mockResolvedValue("Deleted");
      await coursesStore.asyncSetIsCourseDelete(1);
      expect(coursesStore.isCourseDeleted).toBe(true);
      expect(coursesStore.isCourseDelete).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Deleted");

      vi.spyOn(courseApi, "deleteCourse").mockRejectedValue(new Error("Delete error"));
      await coursesStore.asyncSetIsCourseDelete(1);
      expect(coursesStore.isCourseDeleted).toBe(false);
      expect(coursesStore.isCourseDelete).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Delete error");
    });

    it("asyncSetIsCoursesDelete handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "deleteAllCourses").mockResolvedValue("All deleted");
      await coursesStore.asyncSetIsCoursesDelete();
      expect(coursesStore.isCoursesDeleted).toBe(true);
      expect(coursesStore.isCoursesDelete).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("All deleted");

      vi.spyOn(courseApi, "deleteAllCourses").mockRejectedValue(new Error("Delete all error"));
      await coursesStore.asyncSetIsCoursesDelete();
      expect(coursesStore.isCoursesDeleted).toBe(false);
      expect(coursesStore.isCoursesDelete).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Delete all error");
    });

    it("asyncSetIsStudentRegister handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "postStudent").mockResolvedValue("Enrolled");
      await coursesStore.asyncSetIsStudentRegister(1);
      expect(coursesStore.isStudentRegistered).toBe(true);
      expect(coursesStore.isStudentRegister).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Enrolled");

      vi.spyOn(courseApi, "postStudent").mockRejectedValue(new Error("Enroll error"));
      await coursesStore.asyncSetIsStudentRegister(1);
      expect(coursesStore.isStudentRegistered).toBe(false);
      expect(coursesStore.isStudentRegister).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Enroll error");
    });

    it("asyncSetIsStudentUnregister handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "deleteStudent").mockResolvedValue("Unenrolled");
      await coursesStore.asyncSetIsStudentUnregister(1);
      expect(coursesStore.isStudentUnregistered).toBe(true);
      expect(coursesStore.isStudentUnregister).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Unenrolled");

      vi.spyOn(courseApi, "deleteStudent").mockRejectedValue(new Error("Unenroll error"));
      await coursesStore.asyncSetIsStudentUnregister(1);
      expect(coursesStore.isStudentUnregistered).toBe(false);
      expect(coursesStore.isStudentUnregister).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Unenroll error");
    });

    it("asyncSetIsRatingAdd handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "postRating").mockResolvedValue("Rating saved");
      await coursesStore.asyncSetIsRatingAdd(1, 5);
      expect(coursesStore.isRatingAdded).toBe(true);
      expect(coursesStore.isRatingAdd).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Rating saved");

      vi.spyOn(courseApi, "postRating").mockRejectedValue(new Error("Rating error"));
      await coursesStore.asyncSetIsRatingAdd(1, 5);
      expect(coursesStore.isRatingAdded).toBe(false);
      expect(coursesStore.isRatingAdd).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Rating error");
    });

    it("asyncSetContent handles success and error", async () => {
      vi.spyOn(courseApi, "getContentById").mockResolvedValue({ id: 10 } as any);
      await coursesStore.asyncSetContent(10);
      expect(coursesStore.content).toEqual({ id: 10 });
      expect(coursesStore.isContent).toBe(true);

      vi.spyOn(courseApi, "getContentById").mockRejectedValue(new Error("Content error"));
      await coursesStore.asyncSetContent(10);
      expect(coursesStore.content).toBeNull();
      expect(coursesStore.isContent).toBe(true);
    });

    it("asyncSetIsContentAdd handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "postContent").mockResolvedValue({ id: 10 } as any);
      await coursesStore.asyncSetIsContentAdd(1, "Title", "yt", "md");
      expect(coursesStore.isContentAdded).toBe(true);
      expect(coursesStore.isContentAdd).toBe(true);
      expect(successSpy).toHaveBeenCalled();

      vi.spyOn(courseApi, "postContent").mockRejectedValue(new Error("Content add error"));
      await coursesStore.asyncSetIsContentAdd(1, "Title", "yt", "md");
      expect(coursesStore.isContentAdded).toBe(false);
      expect(coursesStore.isContentAdd).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Content add error");
    });

    it("asyncSetIsContentChange handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "putContent").mockResolvedValue("Updated content");
      await coursesStore.asyncSetIsContentChange(1, 10, "Title", "yt", "md");
      expect(coursesStore.isContentChanged).toBe(true);
      expect(coursesStore.isContentChange).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Updated content");

      vi.spyOn(courseApi, "putContent").mockRejectedValue(new Error("Content put error"));
      await coursesStore.asyncSetIsContentChange(1, 10, "Title", "yt", "md");
      expect(coursesStore.isContentChanged).toBe(false);
      expect(coursesStore.isContentChange).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Content put error");
    });

    it("asyncSetIsContentDelete handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "deleteContent").mockResolvedValue("Deleted content");
      await coursesStore.asyncSetIsContentDelete(1, 10);
      expect(coursesStore.isContentDeleted).toBe(true);
      expect(coursesStore.isContentDelete).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Deleted content");

      vi.spyOn(courseApi, "deleteContent").mockRejectedValue(new Error("Content del error"));
      await coursesStore.asyncSetIsContentDelete(1, 10);
      expect(coursesStore.isContentDeleted).toBe(false);
      expect(coursesStore.isContentDelete).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Content del error");
    });

    it("asyncSetIsContentStatus handles success and error", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "putContentStatus").mockResolvedValue("Status updated");
      await coursesStore.asyncSetIsContentStatus(10, 1);
      expect(coursesStore.isContentStatusChanged).toBe(true);
      expect(coursesStore.isContentStatusChange).toBe(true);
      expect(successSpy).toHaveBeenCalledWith("Status updated");

      vi.spyOn(courseApi, "putContentStatus").mockRejectedValue(new Error("Status error"));
      await coursesStore.asyncSetIsContentStatus(10, 1);
      expect(coursesStore.isContentStatusChanged).toBe(false);
      expect(coursesStore.isContentStatusChange).toBe(true);
      expect(errorSpy).toHaveBeenCalledWith("Status error");
    });

    it("handles fallback success messages when API returns empty string", async () => {
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      vi.spyOn(courseApi, "putCourse").mockResolvedValue("");
      await coursesStore.asyncSetIsCourseChange(1, "t", "d");
      expect(successSpy).toHaveBeenCalledWith("Kursus berhasil diubah!");

      vi.spyOn(courseApi, "postCourseCover").mockResolvedValue("");
      await coursesStore.asyncSetIsCourseChangeCover(1, new File([""], "c.jpg"));
      expect(successSpy).toHaveBeenCalledWith("Cover kursus berhasil diubah!");

      vi.spyOn(courseApi, "deleteCourse").mockResolvedValue("");
      await coursesStore.asyncSetIsCourseDelete(1);
      expect(successSpy).toHaveBeenCalledWith("Kursus berhasil dihapus!");

      vi.spyOn(courseApi, "deleteAllCourses").mockResolvedValue("");
      await coursesStore.asyncSetIsCoursesDelete();
      expect(successSpy).toHaveBeenCalledWith("Semua kursus berhasil dihapus!");

      vi.spyOn(courseApi, "postStudent").mockResolvedValue("");
      await coursesStore.asyncSetIsStudentRegister(1);
      expect(successSpy).toHaveBeenCalledWith("Berhasil mendaftar kursus!");

      vi.spyOn(courseApi, "deleteStudent").mockResolvedValue("");
      await coursesStore.asyncSetIsStudentUnregister(1);
      expect(successSpy).toHaveBeenCalledWith("Berhasil keluar dari kursus!");

      vi.spyOn(courseApi, "postRating").mockResolvedValue("");
      await coursesStore.asyncSetIsRatingAdd(1, 5);
      expect(successSpy).toHaveBeenCalledWith("Rating berhasil diberikan!");

      vi.spyOn(courseApi, "putContent").mockResolvedValue("");
      await coursesStore.asyncSetIsContentChange(1, 10, "t", "y", "c");
      expect(successSpy).toHaveBeenCalledWith("Materi berhasil diubah!");

      vi.spyOn(courseApi, "deleteContent").mockResolvedValue("");
      await coursesStore.asyncSetIsContentDelete(1, 10);
      expect(successSpy).toHaveBeenCalledWith("Materi berhasil dihapus!");

      vi.spyOn(courseApi, "putContentStatus").mockResolvedValue("");
      await coursesStore.asyncSetIsContentStatus(10, 1);
      expect(successSpy).toHaveBeenCalledWith("Status belajar berhasil diperbarui!");
    });
  });
});
