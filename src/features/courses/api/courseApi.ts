import apiHelper from "../../../helpers/apiHelper";

export interface Student {
  id: number;
  user_id?: number;
  name?: string;
  email?: string;
  photo?: string;
}

export interface Rating {
  id?: number;
  user_id: number;
  rating: number;
  created_at?: string;
}

export interface CourseContent {
  id: number;
  course_id: number;
  title: string;
  youtube_url?: string;
  content?: string;
  is_finished?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: number;
  user_id: number;
  title: string;
  description: string;
  cover?: string;
  created_at?: string;
  updated_at?: string;
  author?: {
    id: number;
    name: string;
    email: string;
    photo?: string;
  };
  students?: Student[];
  ratings?: Rating[];
  average_rating?: number;
  total_students?: number;
  contents?: CourseContent[];
}

const courseApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/courses`;

  function _url(path: string) {
    return BASE_URL + path;
  }

  async function postCourse(title: string, description: string): Promise<Course> {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan kursus");
    }

    return result.data;
  }

  async function postCourseCover(courseId: string | number, cover: File): Promise<string> {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${courseId}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover kursus");
    }

    return result.message;
  }

  async function putCourse(
    courseId: string | number,
    title: string,
    description: string
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah kursus");
    }

    return result.message;
  }

  async function getCourses(is_me: string | number | boolean = ""): Promise<Course[]> {
    const targetUrl =
      is_me !== "" && is_me !== null && is_me !== undefined
        ? `/?is_me=${is_me}`
        : "/";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data kursus");
    }

    return result.data?.courses || [];
  }

  async function getCourseById(courseId: string | number): Promise<Course> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail kursus");
    }

    return result.data?.course;
  }

  async function deleteCourse(courseId: string | number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus kursus");
    }

    return result.message;
  }

  async function deleteAllCourses(): Promise<string> {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus semua kursus");
    }

    return result.message;
  }

  async function postStudent(courseId: string | number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students`), {
      method: "POST",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mendaftar kursus");
    }

    return result.message;
  }

  async function deleteStudent(courseId: string | number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal keluar dari kursus");
    }

    return result.message;
  }

  async function postRating(courseId: string | number, rating: number): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/ratings`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal memberikan rating");
    }

    return result.message;
  }

  async function postContent(
    courseId: string | number,
    title: string,
    youtube_url: string,
    content: string
  ): Promise<CourseContent> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/contents`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        youtube_url,
        content,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan konten");
    }

    return result.data;
  }

  async function putContent(
    courseId: string | number,
    contentId: string | number,
    title: string,
    youtube_url: string,
    content: string
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/contents/${contentId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        youtube_url,
        content,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah konten");
    }

    return result.message;
  }

  async function getContentById(contentId: string | number): Promise<CourseContent> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail materi");
    }

    return result.data?.course_content;
  }

  async function deleteContent(
    courseId: string | number,
    contentId: string | number
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/contents/${contentId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus materi");
    }

    return result.message;
  }

  async function putContentStatus(
    contentId: string | number,
    is_finished: number
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}/status`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_finished: is_finished ? 1 : 0,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal memperbarui status belajar");
    }

    return result.message;
  }

  return {
    postCourse,
    postCourseCover,
    putCourse,
    getCourses,
    getCourseById,
    deleteCourse,
    deleteAllCourses,
    postStudent,
    deleteStudent,
    postRating,
    postContent,
    putContent,
    getContentById,
    deleteContent,
    putContentStatus,
  };
})();

export default courseApi;
