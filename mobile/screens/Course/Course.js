import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Icon, Button } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { MockApi } from "../../services/MockDataService"; // Gọi API giả

const Course = ({ route, navigation }) => {
  const { theme } = useContext(MyColorContext);
  const { width } = useWindowDimensions();
  
  // Lấy ID khóa học từ tham số điều hướng
  const { id } = route.params || {}; 
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Nếu đang tải hoặc không có ID
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-slate-500">Không tìm thấy thông tin khóa học</Text>
        <Button mode="text" onPress={() => navigation.goBack()}>Quay lại</Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Ảnh bìa khóa học */}
        <Image 
            source={{ uri: course.image }} 
            style={{ width: "100%", height: 250 }} 
            resizeMode="cover"
        />
        
        <View className="p-5">
          {/* Tên & Giảng viên */}
          <Text className="text-2xl font-bold text-slate-800 mb-2">{course.subject}</Text>
          <View className="flex-row items-center mb-4">
              <Icon source="account-circle-outline" size={20} color="gray" />
              <Text className="ml-2 text-slate-500 font-medium">{course.instructor}</Text>
          </View>

          {/* Giá tiền */}
          <Text className="text-xl font-bold text-blue-600 mb-4">
            {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString()} đ`}
          </Text>

          {/* Mô tả (Render HTML) */}
          <View className="bg-slate-50 p-3 rounded-xl border border-slate-100">
             <Text className="font-bold mb-2 text-slate-700">Giới thiệu khóa học</Text>
             <RenderHtml
                contentWidth={width - 40}
                source={{ html: course.description || "<p>Chưa có mô tả chi tiết.</p>" }}
             />
          </View>
        </View>
        
        {/* Khoảng trống dưới cùng để không bị che bởi nút */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Nút Action cố định ở dưới */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg">
        <Button 
            mode="contained" 
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16, fontWeight: "bold" }}
            className="rounded-full bg-blue-600"
            onPress={() => navigation.navigate("Lesson", { courseId: course.id })}
        >
            {course.price === 0 ? "Vào học ngay" : "Đăng ký ngay"}
        </Button>
      </View>
    </View>
  );
};

export default Course;