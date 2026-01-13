import { View, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { RadioButton, List } from "react-native-paper";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { themeReducers } from "../../utils/reducers/ThemeReducers"; // Đảm bảo import đúng

const Appearance = () => {
  const { theme, themeDispatch } = useContext(MyColorContext);

  const changeTheme = (mode) => {
    themeDispatch({ type: mode });
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-lg font-bold mb-4 text-slate-800">Chế độ giao diện</Text>
      
      <TouchableOpacity 
        onPress={() => changeTheme("light")} 
        className="flex-row items-center justify-between p-4 border border-slate-100 rounded-xl mb-3 bg-slate-50"
      >
        <View className="flex-row items-center">
            <List.Icon icon="white-balance-sunny" color="#f59e0b" />
            <Text className="ml-2 font-medium">Giao diện Sáng</Text>
        </View>
        <RadioButton
            value="light"
            status={theme.mode === "light" ? "checked" : "unchecked"}
            onPress={() => changeTheme("light")}
            color="#2563eb"
        />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => changeTheme("dark")} 
        className="flex-row items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-800"
      >
        <View className="flex-row items-center">
            <List.Icon icon="moon-waning-crescent" color="#ffffff" />
            <Text className="ml-2 font-medium text-white">Giao diện Tối</Text>
        </View>
        <RadioButton
            value="dark"
            status={theme.mode === "dark" ? "checked" : "unchecked"}
            onPress={() => changeTheme("dark")}
            color="#ffffff"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Appearance;