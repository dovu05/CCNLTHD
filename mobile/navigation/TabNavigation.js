import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext } from "react";
import { Icon } from "react-native-paper";
import { MyColorContext } from "../utils/contexts/MyColorContext";

// Import các Stack con
import HomeStack from "./HomeStack";
import SearchStack from "./SearchStack";
import LearningStack from "./LearningStack";
import AccountStack from "./AccountStack";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme } = useContext(MyColorContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background || "#ffffff",
          borderTopColor: theme.colors.border || "#e2e8f0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#2563eb", // Màu xanh active
        tabBarInactiveTintColor: "#94a3b8", // Màu xám inactive
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600"
        }
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{
          title: "Tìm kiếm",
          tabBarIcon: ({ color, size }) => (
            <Icon source="magnify" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="LearningTab"
        component={LearningStack}
        options={{
          title: "Học tập",
          tabBarIcon: ({ color, size }) => (
            <Icon source="play-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AccountTab"
        component={AccountStack}
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color, size }) => (
            <Icon source="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;