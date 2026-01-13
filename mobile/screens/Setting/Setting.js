import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { List, Divider } from "react-native-paper";
import { useContext } from "react";
import { MyColorContext } from "../../utils/contexts/MyColorContext";

// Import trực tiếp file config JSON (vì đây là dữ liệu tĩnh)
import settingsData from "../../mock/data.config.settings.json"; 

const Setting = ({ navigation }) => {
  const { theme } = useContext(MyColorContext);

  const handlePress = (item) => {
    if (item.nav) {
      navigation.navigate(item.nav);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={settingsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
             {/* Nếu là Header của nhóm cài đặt */}
             {item.type === "header" && (
                <Text className="px-4 py-3 text-slate-500 font-bold bg-slate-50 uppercase text-xs">
                    {item.title}
                </Text>
             )}
             
             {/* Nếu là Item cài đặt có thể bấm */}
             {item.type === "item" && (
                <List.Item
                    title={item.title}
                    description={item.sub_title}
                    left={(props) => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => handlePress(item)}
                    style={{ paddingVertical: 8 }}
                />
             )}
             <Divider />
          </View>
        )}
      />
    </View>
  );
};

export default Setting;