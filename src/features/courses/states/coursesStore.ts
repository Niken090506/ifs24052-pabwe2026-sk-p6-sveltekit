import { writable } from "svelte/store";
import courseApi, {
  type Course,
  type CourseContent,
} from "../api/courseApi";
import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";

export interface CoursesState {
  courses: Course[];
  course: Course | null;
  content: CourseContent | null;
  isCourse: boolean;
  isCourseAdd: boolean;
  isCourseAdded: boolean;
  isCourseChange: boolean;
  isCourseChanged: boolean;
  isCourseChangeCover: boolean;
  isCourseChangedCover: boolean;
  isCourseDelete: boolean;
  isCourseDeleted: boolean;
  isCoursesDelete: boolean;
  isCoursesDeleted: boolean;
  isStudentRegister: boolean;
  isStudentRegistered: boolean;
  isStudentUnregister: boolean;
  isStudentUnregistered: boolean;
  isRatingAdd: boolean;
  isRatingAdded: boolean;
  isContent: boolean;
  isContentAdd: boolean;
  isContentAdded: boolean;
  isContentChange: boolean;
  isContentChanged: boolean;
  isContentDelete: boolean;
  isContentDeleted: boolean;
  isContentStatusChange: boolean;
  isContentStatusChanged: boolean;
}

function createCoursesStore() {
  const initial: CoursesState = {
    courses: [],
    course: null,
    content: null,
    isCourse: false,
    isCourseAdd: false,
    isCourseAdded: false,
    isCourseChange: false,
    isCourseChanged: false,
    isCourseChangeCover: false,
    isCourseChangedCover: false,
    isCourseDelete: false,
    isCourseDeleted: false,
    isCoursesDelete: false,
    isCoursesDeleted: false,
    isStudentRegister: false,
    isStudentRegistered: false,
    isStudentUnregister: false,
    isStudentUnregistered: false,
    isRatingAdd: false,
    isRatingAdded: false,
    isContent: false,
    isContentAdd: false,
    isContentAdded: false,
    isContentChange: false,
    isContentChanged: false,
    isContentDelete: false,
    isContentDeleted: false,
    isContentStatusChange: false,
    isContentStatusChanged: false,
  };

  let currentState: CoursesState = { ...initial };
  const innerStore = writable<CoursesState>(currentState);
  innerStore.subscribe((val) => {
    currentState = val;
  });

  return {
    subscribe: innerStore.subscribe,
    get courses() {
      return currentState.courses;
    },
    get course() {
      return currentState.course;
    },
    get content() {
      return currentState.content;
    },
    get isCourse() {
      return currentState.isCourse;
    },
    get isCourseAdd() {
      return currentState.isCourseAdd;
    },
    get isCourseAdded() {
      return currentState.isCourseAdded;
    },
    get isCourseChange() {
      return currentState.isCourseChange;
    },
    get isCourseChanged() {
      return currentState.isCourseChanged;
    },
    get isCourseChangeCover() {
      return currentState.isCourseChangeCover;
    },
    get isCourseChangedCover() {
      return currentState.isCourseChangedCover;
    },
    get isCourseDelete() {
      return currentState.isCourseDelete;
    },
    get isCourseDeleted() {
      return currentState.isCourseDeleted;
    },
    get isCoursesDelete() {
      return currentState.isCoursesDelete;
    },
    get isCoursesDeleted() {
      return currentState.isCoursesDeleted;
    },
    get isStudentRegister() {
      return currentState.isStudentRegister;
    },
    get isStudentRegistered() {
      return currentState.isStudentRegistered;
    },
    get isStudentUnregister() {
      return currentState.isStudentUnregister;
    },
    get isStudentUnregistered() {
      return currentState.isStudentUnregistered;
    },
    get isRatingAdd() {
      return currentState.isRatingAdd;
    },
    get isRatingAdded() {
      return currentState.isRatingAdded;
    },
    get isContent() {
      return currentState.isContent;
    },
    get isContentAdd() {
      return currentState.isContentAdd;
    },
    get isContentAdded() {
      return currentState.isContentAdded;
    },
    get isContentChange() {
      return currentState.isContentChange;
    },
    get isContentChanged() {
      return currentState.isContentChanged;
    },
    get isContentDelete() {
      return currentState.isContentDelete;
    },
    get isContentDeleted() {
      return currentState.isContentDeleted;
    },
    get isContentStatusChange() {
      return currentState.isContentStatusChange;
    },
    get isContentStatusChanged() {
      return currentState.isContentStatusChanged;
    },
    get $state() {
      return currentState;
    },
    reset(state: Partial<CoursesState> = initial) {
      innerStore.set({ ...initial, ...state });
    },
    setCourses(courses: Course[]) {
      innerStore.update((s) => ({ ...s, courses }));
    },
    setCourse(course: Course | null) {
      innerStore.update((s) => ({ ...s, course }));
    },
    setContent(content: CourseContent | null) {
      innerStore.update((s) => ({ ...s, content }));
    },
    setIsCourse(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourse: status }));
    },
    setIsCourseAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdd: status }));
    },
    setIsCourseAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdded: status }));
    },
    setIsCourseChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChange: status }));
    },
    setIsCourseChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChanged: status }));
    },
    setIsCourseChangeCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangeCover: status }));
    },
    setIsCourseChangedCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangedCover: status }));
    },
    setIsCourseDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDelete: status }));
    },
    setIsCourseDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeleted: status }));
    },
    setIsCoursesDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isCoursesDelete: status }));
    },
    setIsCoursesDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isCoursesDeleted: status }));
    },
    setIsStudentRegister(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentRegister: status }));
    },
    setIsStudentRegistered(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentRegistered: status }));
    },
    setIsStudentUnregister(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentUnregister: status }));
    },
    setIsStudentUnregistered(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentUnregistered: status }));
    },
    setIsRatingAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isRatingAdd: status }));
    },
    setIsRatingAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isRatingAdded: status }));
    },
    setIsContent(status: boolean) {
      innerStore.update((s) => ({ ...s, isContent: status }));
    },
    setIsContentAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentAdd: status }));
    },
    setIsContentAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentAdded: status }));
    },
    setIsContentChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChange: status }));
    },
    setIsContentChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChanged: status }));
    },
    setIsContentDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentDelete: status }));
    },
    setIsContentDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentDeleted: status }));
    },
    setIsContentStatusChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentStatusChange: status }));
    },
    setIsContentStatusChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentStatusChanged: status }));
    },
    async asyncSetCourses(is_me: string | number | boolean = "") {
      try {
        const courses = await courseApi.getCourses(is_me);
        this.setCourses(courses);
      } catch {
        this.setCourses([]);
      }
    },
    async asyncSetCourse(courseId: string | number) {
      try {
        const course = await courseApi.getCourseById(courseId);
        this.setCourse(course);
      } catch {
        this.setCourse(null);
      } finally {
        this.setIsCourse(true);
      }
    },
    async asyncSetIsCourseAdd(title: string, description: string) {
      try {
        await courseApi.postCourse(title, description);
        showSuccessDialog("Kursus berhasil ditambahkan!");
        this.setIsCourseAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseAdded(false);
      } finally {
        this.setIsCourseAdd(true);
      }
    },
    async asyncSetIsCourseChange(
      courseId: string | number,
      title: string,
      description: string
    ) {
      try {
        const message = await courseApi.putCourse(courseId, title, description);
        showSuccessDialog(message || "Kursus berhasil diubah!");
        this.setIsCourseChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChanged(false);
      } finally {
        this.setIsCourseChange(true);
      }
    },
    async asyncSetIsCourseChangeCover(courseId: string | number, cover: File) {
      try {
        const message = await courseApi.postCourseCover(courseId, cover);
        showSuccessDialog(message || "Cover kursus berhasil diubah!");
        this.setIsCourseChangedCover(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChangedCover(false);
      } finally {
        this.setIsCourseChangeCover(true);
      }
    },
    async asyncSetIsCourseDelete(courseId: string | number) {
      try {
        const message = await courseApi.deleteCourse(courseId);
        showSuccessDialog(message || "Kursus berhasil dihapus!");
        this.setIsCourseDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseDeleted(false);
      } finally {
        this.setIsCourseDelete(true);
      }
    },
    async asyncSetIsCoursesDelete() {
      try {
        const message = await courseApi.deleteAllCourses();
        showSuccessDialog(message || "Semua kursus berhasil dihapus!");
        this.setIsCoursesDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCoursesDeleted(false);
      } finally {
        this.setIsCoursesDelete(true);
      }
    },
    async asyncSetIsStudentRegister(courseId: string | number) {
      try {
        const message = await courseApi.postStudent(courseId);
        showSuccessDialog(message || "Berhasil mendaftar kursus!");
        this.setIsStudentRegistered(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsStudentRegistered(false);
      } finally {
        this.setIsStudentRegister(true);
      }
    },
    async asyncSetIsStudentUnregister(courseId: string | number) {
      try {
        const message = await courseApi.deleteStudent(courseId);
        showSuccessDialog(message || "Berhasil keluar dari kursus!");
        this.setIsStudentUnregistered(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsStudentUnregistered(false);
      } finally {
        this.setIsStudentUnregister(true);
      }
    },
    async asyncSetIsRatingAdd(courseId: string | number, rating: number) {
      try {
        const message = await courseApi.postRating(courseId, rating);
        showSuccessDialog(message || "Rating berhasil diberikan!");
        this.setIsRatingAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsRatingAdded(false);
      } finally {
        this.setIsRatingAdd(true);
      }
    },
    async asyncSetContent(contentId: string | number) {
      try {
        const content = await courseApi.getContentById(contentId);
        this.setContent(content);
      } catch {
        this.setContent(null);
      } finally {
        this.setIsContent(true);
      }
    },
    async asyncSetIsContentAdd(
      courseId: string | number,
      title: string,
      youtube_url: string,
      content: string
    ) {
      try {
        await courseApi.postContent(courseId, title, youtube_url, content);
        showSuccessDialog("Materi berhasil ditambahkan!");
        this.setIsContentAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentAdded(false);
      } finally {
        this.setIsContentAdd(true);
      }
    },
    async asyncSetIsContentChange(
      courseId: string | number,
      contentId: string | number,
      title: string,
      youtube_url: string,
      content: string
    ) {
      try {
        const message = await courseApi.putContent(
          courseId,
          contentId,
          title,
          youtube_url,
          content
        );
        showSuccessDialog(message || "Materi berhasil diubah!");
        this.setIsContentChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentChanged(false);
      } finally {
        this.setIsContentChange(true);
      }
    },
    async asyncSetIsContentDelete(
      courseId: string | number,
      contentId: string | number
    ) {
      try {
        const message = await courseApi.deleteContent(courseId, contentId);
        showSuccessDialog(message || "Materi berhasil dihapus!");
        this.setIsContentDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentDeleted(false);
      } finally {
        this.setIsContentDelete(true);
      }
    },
    async asyncSetIsContentStatus(
      contentId: string | number,
      is_finished: number
    ) {
      try {
        const message = await courseApi.putContentStatus(contentId, is_finished);
        showSuccessDialog(message || "Status belajar berhasil diperbarui!");
        this.setIsContentStatusChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentStatusChanged(false);
      } finally {
        this.setIsContentStatusChange(true);
      }
    },
  };
}

export const coursesStore = createCoursesStore();
export const useCoursesStore = () => coursesStore;
export default coursesStore;
