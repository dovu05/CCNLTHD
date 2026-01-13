import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useContext } from "react";
import { Avatar, List, Divider } from "react-native-paper";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

const Account = ({ navigation }) => {
  const [user, dispatch] = useContext(MyUserContext);
  const { theme } = useContext(MyColorContext);

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      { 
        text: "Đồng ý", 
        onPress: () => {
           dispatch({ type: "logout" });
           // Chuyển về màn hình Login (Reset lại stack)
           // Lưu ý: Nếu App.js check user null -> tự render Login thì không cần dòng dưới
        } 
      }
    ]);
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="mb-4 text-slate-500">Bạn chưa đăng nhập</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} className="bg-blue-600 px-6 py-2 rounded-full">
            <Text className="text-white font-bold">Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header Profile */}
      <View className="bg-white p-6 items-center border-b border-slate-200 mb-4">
        <Avatar.Image size={100} source={{ uri: user.avatar || "https://i.pravatar.cc/300" }} />
        <Text className="text-2xl font-bold mt-4 text-slate-800">{user.last_name} {user.first_name}</Text>
        <Text className="text-slate-500">@{user.username}</Text>
        <Text className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase">{user.role}</Text>
      </View>

      {/* Menu Options */}
      <View className="bg-white px-2">
        <List.Item
          title="Thông tin cá nhân"
          description="Chỉnh sửa hồ sơ, avatar"
          left={(props) => <List.Icon {...props} icon="account-edit" color={theme.colors.primary} />}
          onPress={() => navigation.navigate("AccountDetailed")}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Khóa học của tôi"
          description="Tiến độ học tập"
          left={(props) => <List.Icon {...props} icon="school" color={theme.colors.primary} />}
          onPress={() => navigation.navigate("UserLearning")}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Cài đặt"
          description="Giao diện, ngôn ngữ"
          left={(props) => <List.Icon {...props} icon="cog" color={theme.colors.primary} />}
          onPress={() => navigation.navigate("Setting")}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </View>

      <View className="mt-6 px-4">
        <TouchableOpacity onPress={handleLogout} className="bg-red-50 p-4 rounded-xl flex-row justify-center items-center border border-red-100">
             <List.Icon icon="logout" color="#ef4444" style={{margin:0, padding:0, height:24, width:24}} />
             <Text className="text-red-500 font-bold ml-2">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      
      <View className="h-10"/>
    </ScrollView>
  );
};

export default Account;