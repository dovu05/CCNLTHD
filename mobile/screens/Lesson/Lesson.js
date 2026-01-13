import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Icon } from "react-native-paper";
import { MockApi } from "../../services/MockDataService"; // Gọi API giả
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const Lesson = ({ route, navigation }) => {
  // Lấy ID khóa học truyền từ màn hình Course
  const { courseId } = route.params;
  const { theme } = useContext(MyColorContext);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        // Gọi Mock Service để lấy danh sách bài học
        const res = await MockApi.getLessons(courseId);
        setLessons(res.data.results);
      } catch (error) {
        console.error("Lỗi tải bài học:", error);
      } finally {
        setLoading(false);
      }
    };
    loadLessons();
  }, [courseId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} color={theme.colors.primary} />;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            // Khi bấm vào bài học -> Chuyển sang màn hình học (LessonLearning)
            onPress={() => navigation.navigate("LessonLearning", { lessonId: item.id })}
            className="flex-row p-4 border-b border-slate-100 items-center bg-white active:bg-slate-50"
          >
            {/* Số thứ tự bài học */}
            <Text className="font-bold text-slate-400 mr-4 text-lg w-6 text-center">{index + 1}</Text>
            
            <View className="flex-1">
                <Text className="font-medium text-slate-800 text-base mb-1">{item.subject}</Text>
                <View className="flex-row items-center">
                    <Icon source="clock-outline" size={12} color="#94a3b8" />
                    <Text className="text-xs text-slate-400 ml-1">10:00 • Video</Text>
                </View>
            </View>
            
            {/* Nút Play */}
            <Icon source="play-circle" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-slate-400 mt-10">Chưa có bài học nào trong khóa này.</Text>
        }
      />
    </View>
  );
};

export default Lesson;