import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useContext } from "react";
import { CategoriesContext } from "../../utils/contexts/CategoriesContext";

export const HomeCategories = ({ theme }) => {
  const { categories, loading } = useContext(CategoriesContext);

  if (loading || categories.length === 0) return null;

  return (
    <View className="pl-4">
      <Text className="font-bold text-lg mb-3 text-slate-800">Danh mục nổi bật</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((c) => (
          <TouchableOpacity 
            key={c.id} 
            className="mr-4 items-center"
            // Thêm action chuyển trang Search với filter category nếu cần
          >
            <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-sm border border-slate-100 mb-2">
               <Image source={{ uri: c.image }} style={{ width: 32, height: 32 }} resizeMode="contain" />
            </View>
            <Text className="text-xs font-medium text-slate-600">{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};