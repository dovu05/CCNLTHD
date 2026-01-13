import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home/Home";
import Course from "../screens/Course/Course";
import Lesson from "../screens/Lesson/Lesson";
import LessonLearning from "../screens/Lesson/LessonLearning";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="CourseDetailedScreen" component={Course} options={{ headerShown: true, title: "Chi tiết khóa học" }} />
      <Stack.Screen name="Lesson" component={Lesson} options={{ headerShown: true, title: "Danh sách bài học" }} />
      <Stack.Screen name="LessonLearning" component={LessonLearning} options={{ headerShown: true, title: "Đang học" }} />
    </Stack.Navigator>
  );
};
export default HomeStack;