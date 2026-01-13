import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "../screens/Search/Search";
import Course from "../screens/Course/Course";

const Stack = createNativeStackNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      {/* Để khi bấm vào kết quả tìm kiếm sẽ nhảy sang trang chi tiết */}
      <Stack.Screen name="CourseDetailedScreen" component={Course} options={{ headerShown: true, title: "" }} />
    </Stack.Navigator>
  );
};
export default SearchStack;