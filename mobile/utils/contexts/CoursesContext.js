import { createContext, useState, useCallback, useRef } from "react";
import { MockApi } from "../../services/MockDataService"; // Dùng Mock Service

export const CourseContext = createContext(null);

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const lastFetchdAtRef = useRef(0);

  const ensureCourses = useCallback(async () => {
    const now = Date.now();
    // Cache: Nếu đã có data và chưa quá 5 phút thì không load lại
    if (courses.length > 0 && now - lastFetchdAtRef.current < 300000)
      return courses;

    setLoadingCourses(true);
    setCoursesError(null);
    try {
      // THAY ĐỔI: Gọi Mock API
      const res = await MockApi.getCourses();
      const results = res?.data?.results ?? [];
      
      setCourses(results);
      lastFetchdAtRef.current = now;
      return results;
    } catch (error) {
      console.error("Lỗi tải Courses (Mock):", error);
      setCoursesError("Không thể tải dữ liệu giả lập.");
      throw error;
    } finally {
      setLoadingCourses(false);
    }
  }, [courses]);

  const refreshCourses = useCallback(async () => {
    lastFetchdAtRef.current = 0;
    return ensureCourses();
  }, [ensureCourses]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        setCourses,
        loadingCourses,
        coursesError,
        ensureCourses,
        refreshCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
