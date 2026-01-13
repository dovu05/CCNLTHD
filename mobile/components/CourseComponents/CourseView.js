import { Text, Image, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";

const CourseView = ({ navigation, item, theme }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        // Điều hướng sang màn hình Chi tiết khóa học
        navigation.navigate("CourseDetailedScreen", { id: item.id })
      }
      className="mr-5 mb-5 bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 w-72"
    >
      {/* 1. Ảnh lớn phía trên */}
      <View className="relative h-44 bg-slate-200">
        <Image
          source={{ uri: item?.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Badge Giá tiền */}
        <View className="absolute bottom-3 right-3 bg-white/95 px-3 py-1.5 rounded-xl shadow-sm">
           <Text className={`font-bold text-xs ${item.price <= 0 ? 'text-green-600' : 'text-slate-900'}`}>
            {Number(item.price) > 0 ? formatCurrency(Number(item.price)) : "Miễn phí"}
          </Text>
        </View>
        
        {/* Badge Category */}
        <View className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full">
          <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
             {item?.category || "Khóa học"}
          </Text>
        </View>
      </View>

      {/* 2. Thông tin phía dưới */}
      <View className="p-4 pt-3">
        <Text 
          numberOfLines={2} 
          className="text-lg font-bold text-slate-800 leading-6 h-12 mb-2"
        >
          {item?.subject}
        </Text>

        <View className="flex-row items-center justify-between mt-1">
           <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-lg">
              <Icon source="account-circle-outline" size={14} color={theme?.colors?.slate?.[500] || 'gray'} />
              <Text className="text-xs text-slate-500 ml-1 font-medium max-w-[100px]" numberOfLines={1}>
                {item?.instructor}
              </Text>
           </View>
           
           <View className="bg-blue-50 p-2 rounded-full">
              <Icon source="arrow-right" size={16} color={theme?.colors?.primary || 'blue'} />
           </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default CourseView;