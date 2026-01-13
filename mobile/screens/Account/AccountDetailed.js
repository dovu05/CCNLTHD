import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useContext } from "react";
import { Avatar, TextInput, Button } from "react-native-paper";
import { MyUserContext } from "../../utils/contexts/MyContext";
import * as ImagePicker from "expo-image-picker";

const AccountDetailed = () => {
  const [user, dispatch] = useContext(MyUserContext);
  
  // State cục bộ để chỉnh sửa
  const [profile, setProfile] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    avatar: user?.avatar || null
  });

  const handleSave = () => {
    // Cập nhật vào Context (Giả lập việc lưu xuống DB)
    const updatedUser = { ...user, ...profile };
    dispatch({ type: "login", payload: updatedUser });
    
    Alert.alert("Thành công", "Thông tin đã được cập nhật!");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, avatar: result.assets[0].uri });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-5">
      <View className="items-center mb-6">
        <TouchableOpacity onPress={pickImage}>
            <Avatar.Image size={100} source={{ uri: profile.avatar || "https://i.pravatar.cc/300" }} />
            <Text className="text-blue-600 mt-2 font-medium">Đổi ảnh đại diện</Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-4 mb-6">
        <TextInput 
            label="Họ" mode="outlined" 
            value={profile.last_name} 
            onChangeText={(t) => setProfile({...profile, last_name: t})} 
        />
        <TextInput 
            label="Tên" mode="outlined" 
            value={profile.first_name} 
            onChangeText={(t) => setProfile({...profile, first_name: t})} 
        />
        <TextInput 
            label="Email" mode="outlined" 
            value={profile.email} 
            onChangeText={(t) => setProfile({...profile, email: t})} 
        />
      </View>

      <Button mode="contained" onPress={handleSave} className="bg-blue-600 py-1 rounded-lg">
        Lưu thay đổi
      </Button>
    </ScrollView>
  );
};

export default AccountDetailed;