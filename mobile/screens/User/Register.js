import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useState } from "react";
import { TextInput, ActivityIndicator, HelperText } from "react-native-paper";
import { MockApi } from "../../api/MockDataService";

const Register = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirm_password: "",
    email: "",
  });
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // Validate cơ bản
    if (user.password !== user.confirm_password) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!user.username || !user.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Gọi Mock API
      await MockApi.register(user);
      Alert.alert("Thành công", "Đăng ký tài khoản thành công! Vui lòng đăng nhập.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      setError("Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <View className="items-center mb-8">
        <Image 
            source={require("../../assets/logo_OUCourse.png")} 
            style={{ width: 80, height: 80, resizeMode: 'contain' }} 
        />
        <Text className="text-2xl font-bold text-blue-600 mt-2">Tạo tài khoản mới</Text>
      </View>

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <View className="space-y-4">
        <TextInput label="Họ" mode="outlined" value={user.last_name} onChangeText={(t) => handleChange("last_name", t)} />
        <TextInput label="Tên" mode="outlined" value={user.first_name} onChangeText={(t) => handleChange("first_name", t)} />
        <TextInput label="Email" mode="outlined" value={user.email} onChangeText={(t) => handleChange("email", t)} />
        <TextInput label="Tên đăng nhập" mode="outlined" value={user.username} onChangeText={(t) => handleChange("username", t)} autoCapitalize="none" />
        <TextInput label="Mật khẩu" mode="outlined" secureTextEntry value={user.password} onChangeText={(t) => handleChange("password", t)} />
        <TextInput label="Nhập lại mật khẩu" mode="outlined" secureTextEntry value={user.confirm_password} onChangeText={(t) => handleChange("confirm_password", t)} />
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className="bg-blue-600 p-4 rounded-xl mt-8 items-center"
      >
        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">ĐĂNG KÝ</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6 items-center mb-10">
        <Text className="text-slate-500">Đã có tài khoản? <Text className="text-blue-600 font-bold">Đăng nhập</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Register;