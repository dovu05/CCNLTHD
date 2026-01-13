import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { MyColorContext } from "./utils/contexts/MyColorContext";
import MyReducers from "./utils/reducers/MyReducers";
import { MyUserContext } from "./utils/contexts/MyContext";
import { ActivityIndicator } from "react-native-paper";
import { useEffect, useReducer, useState } from "react";
import { initialThemeState, ThemeReducer } from "./utils/reducers/ThemeReducers";
import TabNavigator from "./navigation/TabNavigation";
import { CoursesProvider } from "./utils/contexts/CoursesContext";
import { CategoriesProvider } from "./utils/contexts/CategoriesContext";

// THAY ĐỔI: Import MockApi
import { MockApi } from "./services/MockDataService";

export default function App() {
  const [user, dispatch] = useReducer(MyReducers, null);
  const [theme, themeDispatch] = useReducer(ThemeReducer, initialThemeState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hydrateAuth = async () => {
      setLoading(true);
      try {
        // THAY ĐỔI: Gọi Mock API để lấy User giả lập
        // Nếu bạn muốn test "Chưa đăng nhập", hãy comment dòng này lại
        const res = await MockApi.getCurrentUser();
        
        if (res?.data) {
          dispatch({
            type: "login",
            payload: res.data,
          });
        }
      } catch (error) {
        console.log("Mock Mode: Người dùng chưa đăng nhập hoặc lỗi mock data");
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <MyColorContext.Provider value={{ theme, themeDispatch }}>
      <MyUserContext.Provider value={[user, dispatch]}>
        <NavigationContainer>
          <CoursesProvider>
            <CategoriesProvider>
              <TabNavigator />
            </CategoriesProvider>
          </CoursesProvider>
        </NavigationContainer>
      </MyUserContext.Provider>
    </MyColorContext.Provider>
  );
}