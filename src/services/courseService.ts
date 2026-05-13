import { API_CONFIG, getAuthHeaders } from "../utils/apiConfig";

export type CourseCategory = "forex" | "crypto" | "general";

export interface Course {
  _id: string;
  title: string;
  description?: string;
  category: CourseCategory;
  lessons: number;
  duration: string;
  premium: boolean;
  price?: number;
  thumbnailUrl?: string;
  published?: boolean;
  enrolled?: number;
}

export interface CoursesListResponse {
  success: boolean;
  message: string;
  items: Course[];
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CourseDetailResponse {
  success: boolean;
  message: string;
  course: Course;
}

export interface MyEnrollmentItem {
  enrollmentId: string;
  courseId: string;
  title: string;
  lessons: number;
  completed: number;
  duration: string;
  premium: boolean;
  status: "in-progress" | "completed";
  category: CourseCategory;
}

const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.TIMEOUT
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]) as Promise<Response>;
};

export const fetchPublishedCourses = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  premium?: boolean;
  search?: string;
}): Promise<CoursesListResponse> => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (params?.category && params.category !== "All") {
    qs.append("category", params.category);
  }
  if (params?.premium === true) {
    qs.append("premium", "true");
  }
  if (params?.search) {
    qs.append("search", params.search);
  }

  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses?${qs.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load courses");
  }
  return data;
};

export const fetchCourseById = async (id: string): Promise<Course> => {
  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data: CourseDetailResponse = await res.json();
  if (!res.ok || !data.success) {
    throw new Error((data as any).message || "Course not found");
  }
  return data.course;
};

export const enrollInCourse = async (courseId: string): Promise<{ success: boolean; message: string }> => {
  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/${courseId}/enroll`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to enroll");
  }
  return data;
};

export const fetchMyCourseEnrollments = async (): Promise<MyEnrollmentItem[]> => {
  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/enrollments/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load enrollments");
  }
  return data.items || [];
};

export const updateCourseProgress = async (
  courseId: string,
  lessonsCompleted: number
): Promise<void> => {
  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/enrollments/${courseId}/progress`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ lessonsCompleted }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update progress");
  }
};

/** Admin: list all courses (including unpublished) */
export const adminFetchCourses = async (params?: {
  page?: number;
  limit?: number;
  published?: "" | "true" | "false";
  search?: string;
}): Promise<CoursesListResponse> => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (params?.published) qs.append("published", params.published);
  if (params?.search) qs.append("search", params.search);

  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/admin?${qs.toString()}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to load courses");
  }
  return data;
};

export const adminCreateCourse = async (payload: {
  title: string;
  description?: string;
  category?: CourseCategory;
  lessons: number;
  duration: string;
  premium?: boolean;
  price?: number;
  thumbnailUrl?: string;
  published?: boolean;
}): Promise<Course> => {
  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/admin`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to create course");
  }
  return data.course;
};

export const adminUpdateCourse = async (
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    category: CourseCategory;
    lessons: number;
    duration: string;
    premium: boolean;
    price: number;
    thumbnailUrl: string;
    published: boolean;
  }>
): Promise<Course> => {
  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/admin/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update course");
  }
  return data.course;
};

export const adminDeleteCourse = async (id: string): Promise<void> => {
  const res = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/courses/admin/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete course");
  }
};
