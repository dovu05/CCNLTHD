import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useState, useEffect, useContext } from "react";
import { Searchbar, ActivityIndicator, Icon } from "react-native-paper";
import { MockApi } from "../../services/MockDataService"; // Dùng Mock
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const SearchScreen = ({ navigation }) => {
  const { theme } = useContext(MyColorContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Load tất cả khóa học Mock về trước
  useEffect(() => {
    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await MockApi.getCourses();
            setCourses(res.data.results);
            setFilteredCourses(res.data.results); // Ban đầu hiển thị hết
        } catch(e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    fetchAll();
  }, []);

  // 2. Hàm lọc local mỗi khi gõ phím
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
        setFilteredCourses(courses);
        return;
    }
    
    // Filter không phân biệt hoa thường
    const lowerQuery = query.toLowerCase();
    const result = courses.filter(c => 
        c.subject.toLowerCase().includes(lowerQuery) || 
        c.category.toLowerCase().includes(lowerQuery)
    );
    setFilteredCourses(result);
  };

  return (
    <View className="flex-1 bg-white pt-10 px-4">
      <Searchbar
        placeholder="Tìm khóa học, giảng viên..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        className="bg-slate-100 rounded-xl mb-4 shadow-none border border-slate-200"
        inputStyle={{ color: theme.colors.text }}
        iconColor={theme.colors.primary}
      />

      {loading ? (
        <ActivityIndicator className="mt-10" />
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text className="text-center text-slate-400 mt-10">Không tìm thấy kết quả</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("CourseDetailedScreen", { id: item.id })}
              className="flex-row mb-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm"
            >
              <Image 
                source={{ uri: item.image }} 
                className="w-24 h-24 rounded-lg bg-slate-200" 
                resizeMode="cover"
              />
              <View className="flex-1 ml-3 justify-center">
                <Text className="text-[10px] uppercase font-bold text-blue-500 mb-1">{item.category}</Text>
                <Text className="font-bold text-base text-slate-800 mb-1" numberOfLines={2}>{item.subject}</Text>
                <Text className="text-xs text-slate-500">{item.instructor}</Text>
                <Text className="text-red-500 font-bold mt-2">
                    {item.price === 0 ? "Miễn phí" : item.price.toLocaleString() + " đ"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default SearchScreen;