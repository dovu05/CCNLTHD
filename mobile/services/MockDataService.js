import coursesData from '../mock/courses.json';
import categoriesData from '../mock/categories.json';
import lessonsData from '../mock/lessons.json';
import userData from '../mock/user.json';
import bannersData from '../mock/banners.json';
import commentsData from '../mock/comments.json';

const SIMULATE_DELAY = 500; // Giả lập độ trễ mạng (ms)

// Hàm helper để tạo delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const MockApi = {
  // ==============================
  // 1. AUTHENTICATION (Xác thực)
  // ==============================
  
  // Giả lập đăng nhập
  login: async (username, password) => {
    await sleep(1000); // Delay lâu hơn chút cho giống thật
    if (username && password) {
      return {
        data: {
          access_token: "mock-access-token-jwt-xyz",
          refresh_token: "mock-refresh-token-abc",
          user: userData
        }
      };
    }
    throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");
  },

  // Lấy thông tin user hiện tại (Dùng cho context)
  getCurrentUser: async () => {
    await sleep(200);
    return { data: userData };
  },

  // Giả lập đăng ký
  register: async (data) => {
    await sleep(1500);
    // Trả về user data kèm theo thông tin vừa nhập
    return { data: { ...userData, ...data } };
  },

  // ==============================
  // 2. COURSES (Khóa học)
  // ==============================
  
  // Lấy danh sách tất cả khóa học
  getCourses: async () => {
    await sleep(SIMULATE_DELAY);
    return { data: { results: coursesData } };
  },

  // Lấy chi tiết một khóa học theo ID
  getCourseDetail: async (courseId) => {
    await sleep(SIMULATE_DELAY);
    const course = coursesData.find((c) => c.id == courseId);
    
    // Nếu không tìm thấy, trả về lỗi hoặc course mặc định đầu tiên để test
    if (!course) {
        // Fallback: Trả về course đầu tiên nếu không tìm thấy (để tránh crash khi test)
        // return { data: coursesData[0] }; 
        throw new Error("Course not found");
    }
    return { data: course };
  },

  // ==============================
  // 3. CATEGORIES (Danh mục)
  // ==============================
  getCategories: async () => {
    await sleep(SIMULATE_DELAY);
    return { data: { results: categoriesData } };
  },

  // ==============================
  // 4. LESSONS (Bài học)
  // ==============================
  
  // Lấy danh sách bài học của một khóa
  getLessons: async (courseId) => {
    await sleep(SIMULATE_DELAY);
    // Lọc bài học theo course_id
    let lessons = lessonsData.filter((l) => l.course_id == courseId);
    
    // Nếu khóa học này chưa có bài trong mock data, trả về toàn bộ bài mẫu để test giao diện
    if (lessons.length === 0) {
        lessons = lessonsData;
    }

    return { data: { results: lessons } };
  },

  // Lấy chi tiết 1 bài học (Dùng cho màn hình Learning)
  getLessonDetail: async (lessonId) => {
    await sleep(SIMULATE_DELAY);
    const lesson = lessonsData.find((l) => l.id == lessonId);
    if (!lesson) throw new Error("Lesson not found");
    return { data: lesson };
  },

  // ==============================
  // 5. BANNERS & OTHERS
  // ==============================
  getBanners: async () => {
    // Banner thường load nhanh nên không cần sleep nhiều
    return { data: { results: bannersData } };
  },

  // ==============================
  // 6. COMMENTS (Bình luận)
  // ==============================
  
  // Lấy danh sách comment của bài học
  getComments: async (lessonId) => {
    await sleep(SIMULATE_DELAY);
    const comments = commentsData.filter(c => c.lesson_id == lessonId);
    return { data: { results: comments } };
  },

  // Gửi comment mới
  addComment: async (lessonId, content) => {
    await sleep(800);
    // Tạo comment giả lập trả về ngay lập tức
    const newComment = {
      id: Math.floor(Math.random() * 100000), // Random ID
      lesson_id: lessonId,
      content: content,
      created_date: new Date().toISOString(),
      user: userData // Người comment chính là user đang đăng nhập
    };
    return { data: newComment };
  },
  
  // Hàm tiện ích format ngày tháng (nếu cần dùng trong App)
  formatDate: (dateString) => {
      if(!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});
  }
};