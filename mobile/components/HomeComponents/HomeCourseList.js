import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CourseView from "../CourseComponents/CourseView"; // Đảm bảo import đúng CourseView mới

export const HomeCourseList = ({ data, text, icon, iconColor, theme }) => {
  const navigation = useNavigation();

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center px-4 mb-3">
        <View className="flex-row items-center">
            {icon && <Icon source={icon} size={20} color={iconColor || theme.colors.primary} />}
            <Text className="font-bold text-lg text-slate-800 ml-2">{text}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Text className="text-blue-600 font-bold text-xs">Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
           <CourseView item={item} navigation={navigation} theme={theme} />
        )}
      />
    </View>
  );
};