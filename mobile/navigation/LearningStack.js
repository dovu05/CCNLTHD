import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserLearning from "../screens/User/UserLearning";
import Course from "../screens/Course/Course";
import LessonLearning from "../screens/Lesson/LessonLearning";

const Stack = createNativeStackNavigator();

const LearningStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserLearningScreen" component={UserLearning} options={{ headerShown: false }} />
      <Stack.Screen name="CourseDetailedScreen" component={Course} options={{ title: "Chi tiết khóa học" }} />
      <Stack.Screen name="LessonLearning" component={LessonLearning} options={{ title: "Học bài" }} />
    </Stack.Navigator>
  );
};
export default LearningStack;