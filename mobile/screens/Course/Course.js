import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import { ActivityIndicator, Icon, Button } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import { Video, ResizeMode } from "expo-av"; // <--- Import thư viện Video
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { MockApi } from "../../services/MockDataService";

const Course = ({ route, navigation }) => {
  const { theme } = useContext(MyColorContext);
  const { width } = useWindowDimensions();
  const { id } = route.params || {};

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State để kiểm soát việc hiện Video hay hiện Ảnh
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await MockApi.getCourseDetail(id);
        setCourse(res.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết khóa học:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!course) return null;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        
        {/* --- KHU VỰC HIỂN THỊ VIDEO TRAILER --- */}
        <View className="w-full h-64 bg-black relative">
          {isPlayingTrailer && course.trailer_video ? (
            // 1. Nếu đang bật chế độ xem Trailer -> Hiện Video Player
            <Video
              style={{ width: "100%", height: "100%" }}
              source={{ uri: course.trailer_video }} // URL từ Cloudinary
              useNativeControls // Hiện thanh tua, volume
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              shouldPlay={true} // Tự động chạy khi hiện ra
              onError={(e) => console.log("Lỗi video:", e)}
            />
          ) : (
            // 2. Mặc định: Hiện Ảnh bìa + Nút Play
            <>
              <Image
                source={{ uri: course.image }}
                style={{ width: "100%", height: "100%", opacity: 0.8 }}
                resizeMode="cover"
              />
              
              {/* Nếu có link trailer thì hiện nút Play ở giữa */}
              {course.trailer_video && (
                <View className="absolute inset-0 justify-center items-center">
                  <TouchableOpacity
                    onPress={() => setIsPlayingTrailer(true)}
                    className="bg-black/50 p-4 rounded-full border border-white/50"
                  >
                    <Icon source="play" size={40} color="white" />
                  </TouchableOpacity>
                  <Text className="text-white font-bold mt-2 text-shadow">Xem Trailer</Text>
                </View>
              )}
            </>
          )}
          
          {/* Nút tắt Video quay về ảnh (chỉ hiện khi đang xem video) */}
          {isPlayingTrailer && (
             <TouchableOpacity 
                onPress={() => setIsPlayingTrailer(false)}
                className="absolute top-2 right-2 bg-black/60 p-1 rounded-full"
             >
                <Icon source="close" size={20} color="white" />
             </TouchableOpacity>
          )}
        </View>
        {/* --------------------------------------- */}

        <View className="p-5">
          <Text className="text-2xl font-bold text-slate-800 mb-2">{course.subject}</Text>
          
          {/* Thông tin phụ: Giảng viên, Thời lượng */}
          <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                  <Icon source="account-circle-outline" size={20} color="gray" />
                  <Text className="ml-2 text-slate-500 font-medium">
                      {course.teacher?.username || course.instructor || "Giảng viên"}
                  </Text>
              </View>
              
              {/* Hiển thị duration từ Model */}
              {course.duration > 0 && (
                <View className="flex-row items-center">
                    <Icon source="clock-time-four-outline" size={18} color="gray" />
                    <Text className="ml-1 text-slate-500 text-xs">
                        {Math.floor(course.duration / 60)} giờ {course.duration % 60} phút
                    </Text>
                </View>
              )}
          </View>

          <Text className="text-xl font-bold text-blue-600 mb-4">
            {course.price === 0 ? "Miễn phí" : `${Number(course.price).toLocaleString()} đ`}
          </Text>

          <View className="bg-slate-50 p-3 rounded-xl border border-slate-100">
             <Text className="font-bold mb-2 text-slate-700">Giới thiệu khóa học</Text>
             <RenderHtml
                contentWidth={width - 40}
                source={{ html: course.description || "<p>Chưa có mô tả chi tiết.</p>" }}
             />
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg">
        <Button 
            mode="contained" 
            contentStyle={{ height: 48 }}
            className="rounded-full bg-blue-600"
            onPress={() => navigation.navigate("Lesson", { courseId: course.id })}
        >
            {Number(course.price) === 0 ? "Vào học ngay" : "Đăng ký ngay"}
        </Button>
      </View>
    </View>
  );
};

export default Course;