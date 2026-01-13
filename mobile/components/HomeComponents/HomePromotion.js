import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomePromotion = () => {
  const navigation = useNavigation();

  return (
    <View className="mx-4 mt-6 mb-2">
      {/* Khung màu xanh dương bo góc */}
      <View className="bg-blue-600 rounded-3xl p-6 flex-row items-center justify-between shadow-lg shadow-blue-200">
        
        {/* Phần chữ bên trái */}
        <View className="flex-1 mr-4">
          <Text className="text-white font-bold text-xl mb-2">Giảm giá 50%</Text>
          <Text className="text-blue-100 text-xs mb-4">
            Ưu đãi đặc biệt cho các khóa học Lập trình Mobile trong tuần này.
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate("SearchTab")}
            className="bg-white py-2 px-4 rounded-xl self-start shadow-sm"
          >
            <Text className="text-blue-600 font-bold text-xs">Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>

        {/* Ảnh trang trí bên phải (Hộp quà) */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/3210/3210036.png" }}
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default HomePromotion;