import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, ProgressBar } from "react-native-paper";
import { MockApi } from "../../services/MockDataService";

const UserLearning = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // Giả lập: Lấy tất cả khóa học và user "đã mua" 2 khóa đầu tiên
        const res = await MockApi.getCourses();
        const allCourses = res.data.results;
        setCourses(allCourses.slice(0, 3)); // Lấy 3 khóa làm mẫu
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) return <ActivityIndicator className="mt-10" />;

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-xl font-bold mb-4 text-slate-800">Tiến độ học tập</Text>
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("CourseDetailedScreen", { id: item.id })} // Chuyển sang chi tiết khóa học
            className="bg-white p-3 rounded-xl mb-4 flex-row shadow-sm"
          >
            <Image 
                source={{ uri: item.image }} 
                className="w-20 h-20 rounded-lg bg-gray-200" 
            />
            <View className="flex-1 ml-3 justify-between">
              <View>
                  <Text className="font-bold text-base text-slate-800" numberOfLines={1}>{item.subject}</Text>
                  <Text className="text-xs text-slate-500 mt-1">{item.instructor}</Text>
              </View>
              
              {/* Giả lập thanh tiến độ ngẫu nhiên */}
              <View>
                  <View className="flex-row justify-between mb-1">
                      <Text className="text-[10px] text-slate-400">Hoàn thành</Text>
                      <Text className="text-[10px] font-bold text-blue-600">75%</Text>
                  </View>
                  <ProgressBar progress={0.75} color="#2563eb" style={{ height: 6, borderRadius: 4 }} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default UserLearning;