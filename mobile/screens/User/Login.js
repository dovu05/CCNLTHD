import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useState, useContext } from "react";
import { TextInput, ActivityIndicator, HelperText, Button } from "react-native-paper";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { MockApi } from "../../services/MockDataService"; // Dùng Mock Service

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("student_test");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const [, dispatch] = useContext(MyUserContext);

  const handleLogin = async () => {
    if (!username || !password) {
      setError(true);
      return;
    }
    
    setLoading(true);
    setError(false);
    
    try {
      // Gọi Mock API
      const res = await MockApi.login(username, password);
      
      // Lưu user vào Context (Global State)
      dispatch({
        type: "login",
        payload: res.data.user,
      });

      // Điều hướng về Home (Reset stack để không back lại login được)
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Tên đăng nhập hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <View className="items-center mb-10">
        <Image 
            source={require("../../assets/logo_OUCourse.png")} 
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
        />
        <Text className="text-3xl font-bold text-blue-600 mt-2">OU Course</Text>
        <Text className="text-slate-400 text-base">Học mọi lúc, mọi nơi</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          label="Tên đăng nhập"
          mode="outlined"
          value={username}
          onChangeText={setUsername}
          left={<TextInput.Icon icon="account" />}
        />
        
        <TextInput
          label="Mật khẩu"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon={secureTextEntry ? "eye" : "eye-off"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
        />
        {error && <HelperText type="error">Vui lòng nhập đầy đủ thông tin</HelperText>}
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-blue-600 p-4 rounded-xl mt-6 items-center shadow-lg shadow-blue-200"
      >
        {loading ? (
            <ActivityIndicator color="white" />
        ) : (
            <Text className="text-white font-bold text-lg">ĐĂNG NHẬP</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-slate-500">Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="text-blue-600 font-bold">Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;