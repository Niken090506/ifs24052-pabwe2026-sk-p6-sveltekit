import { describe, it, expect, vi, beforeEach } from "vitest";
import courseApi from "./courseApi";
import apiHelper from "../../../helpers/apiHelper";

describe("courseApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postCourse", () => {
    it("should send post request and return data on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { id: 1, title: "Course 1" },
        }),
      } as any);

      const res = await courseApi.postCourse("Title", "Description");
      expect(res).toEqual({ id: 1, title: "Course 1" });
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      } as any);

      await expect(courseApi.postCourse("", "")).rejects.toThrow("Data tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.postCourse("", "")).rejects.toThrow("Gagal menambahkan kursus");
    });
  });

  describe("postCourseCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover kursus",
        }),
      } as any);

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await courseApi.postCourseCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover kursus");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      } as any);

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await courseApi.postCourseCover(1, dummyBlob as any);
      expect(msg).toBe("Berhasil");
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      } as any);

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(courseApi.postCourseCover(1, dummyFile)).rejects.toThrow("Format tidak didukung");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(courseApi.postCourseCover(1, dummyFile)).rejects.toThrow("Gagal mengubah cover kursus");
    });
  });

  describe("putCourse", () => {
    it("should update course and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data kursus",
        }),
      } as any);

      const msg = await courseApi.putCourse(1, "Updated", "Desc");
      expect(msg).toBe("Berhasil mengubah data kursus");
    });

    it("should throw error on update failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal update kursus",
        }),
      } as any);

      await expect(courseApi.putCourse(1, "", "")).rejects.toThrow("Gagal update kursus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.putCourse(1, "", "")).rejects.toThrow("Gagal mengubah kursus");
    });
  });

  describe("getCourses", () => {
    it("should fetch all courses without filter", async () => {
      const mockCourses = [{ id: 1, title: "Course 1", description: "desc" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { courses: mockCourses },
        }),
      } as any);

      const courses = await courseApi.getCourses();
      expect(courses).toEqual(mockCourses);
    });

    it("should fetch filtered courses when is_me parameter provided", async () => {
      const mockCourses = [{ id: 2, title: "Course 2", description: "desc" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { courses: mockCourses },
        }),
      } as any);

      const courses = await courseApi.getCourses("1");
      expect(courses).toEqual(mockCourses);
    });

    it("should return empty array if data.courses is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      } as any);

      const courses = await courseApi.getCourses();
      expect(courses).toEqual([]);
    });

    it("should throw error on fetch courses fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses tidak diizinkan",
        }),
      } as any);

      await expect(courseApi.getCourses()).rejects.toThrow("Akses tidak diizinkan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.getCourses()).rejects.toThrow("Gagal mengambil data kursus");
    });
  });

  describe("getCourseById", () => {
    it("should return single course object on success", async () => {
      const mockCourse = { id: 5, title: "Single Course", description: "desc" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { course: mockCourse },
        }),
      } as any);

      const res = await courseApi.getCourseById(5);
      expect(res).toEqual(mockCourse);
    });

    it("should throw error on detail fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Kursus tidak ditemukan",
        }),
      } as any);

      await expect(courseApi.getCourseById(999)).rejects.toThrow("Kursus tidak ditemukan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.getCourseById(999)).rejects.toThrow("Gagal mengambil detail kursus");
    });
  });

  describe("deleteCourse", () => {
    it("should delete course and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus kursus",
        }),
      } as any);

      const msg = await courseApi.deleteCourse(1);
      expect(msg).toBe("Berhasil menghapus kursus");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus",
        }),
      } as any);

      await expect(courseApi.deleteCourse(1)).rejects.toThrow("Gagal menghapus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.deleteCourse(1)).rejects.toThrow("Gagal menghapus kursus");
    });
  });

  describe("deleteAllCourses", () => {
    it("should delete all courses and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Semua kursus berhasil dihapus",
        }),
      } as any);

      const msg = await courseApi.deleteAllCourses();
      expect(msg).toBe("Semua kursus berhasil dihapus");
    });

    it("should throw error on delete all fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus semua kursus",
        }),
      } as any);

      await expect(courseApi.deleteAllCourses()).rejects.toThrow("Gagal menghapus semua kursus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.deleteAllCourses()).rejects.toThrow("Gagal menghapus semua kursus");
    });
  });

  describe("postStudent & deleteStudent", () => {
    it("should register student to course", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mendaftar kursus",
        }),
      } as any);

      const res = await courseApi.postStudent(1);
      expect(res).toBe("Berhasil mendaftar kursus");
    });

    it("should throw on register student fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.postStudent(1)).rejects.toThrow("Gagal mendaftar kursus");
    });

    it("should unregister student from course", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil keluar dari kursus",
        }),
      } as any);

      const res = await courseApi.deleteStudent(1);
      expect(res).toBe("Berhasil keluar dari kursus");
    });

    it("should throw on delete student fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.deleteStudent(1)).rejects.toThrow("Gagal keluar dari kursus");
    });
  });

  describe("postRating", () => {
    it("should submit rating to course", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil memberikan rating",
        }),
      } as any);

      const res = await courseApi.postRating(1, 5);
      expect(res).toBe("Berhasil memberikan rating");
    });

    it("should throw on post rating fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.postRating(1, 5)).rejects.toThrow("Gagal memberikan rating");
    });
  });

  describe("postContent, putContent, getContentById, deleteContent, putContentStatus", () => {
    it("should add content to course", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { id: 10, title: "Materi 1" },
        }),
      } as any);

      const res = await courseApi.postContent(1, "Materi 1", "https://youtube.com/v1", "Content");
      expect(res).toEqual({ id: 10, title: "Materi 1" });
    });

    it("should throw on add content fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.postContent(1, "Materi 1", "", "")).rejects.toThrow("Gagal menambahkan konten");
    });

    it("should update content", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah konten",
        }),
      } as any);

      const res = await courseApi.putContent(1, 10, "Materi Baru", "", "Updated Content");
      expect(res).toBe("Berhasil mengubah konten");
    });

    it("should throw on update content fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.putContent(1, 10, "", "", "")).rejects.toThrow("Gagal mengubah konten");
    });

    it("should get content by id", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { course_content: { id: 10, title: "Materi 1" } },
        }),
      } as any);

      const res = await courseApi.getContentById(10);
      expect(res).toEqual({ id: 10, title: "Materi 1" });
    });

    it("should throw on get content by id fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.getContentById(999)).rejects.toThrow("Gagal mengambil detail materi");
    });

    it("should delete content", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus materi",
        }),
      } as any);

      const res = await courseApi.deleteContent(1, 10);
      expect(res).toBe("Berhasil menghapus materi");
    });

    it("should throw on delete content fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.deleteContent(1, 10)).rejects.toThrow("Gagal menghapus materi");
    });

    it("should update content status", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil memperbarui status belajar",
        }),
      } as any);

      const res = await courseApi.putContentStatus(10, 1);
      expect(res).toBe("Berhasil memperbarui status belajar");

      const res0 = await courseApi.putContentStatus(10, 0);
      expect(res0).toBe("Berhasil memperbarui status belajar");
    });

    it("should throw on update content status fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Status gagal",
        }),
      } as any);

      await expect(courseApi.putContentStatus(10, 1)).rejects.toThrow("Status gagal");
    });

    it("should use fallback error message on update content status fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(courseApi.putContentStatus(10, 0)).rejects.toThrow("Gagal memperbarui status belajar");
    });
  });
});
