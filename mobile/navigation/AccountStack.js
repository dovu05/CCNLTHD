import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Account from "../screens/Account/Account";
import AccountDetailed from "../screens/Account/AccountDetailed";
import Setting from "../screens/Setting/Setting";
import Appearance from "../screens/Setting/Appearance";
import Terms from "../screens/Account/Terms";
import HelpAndFeedback from "../screens/Account/HelpAndFeedback";
import UserLearning from "../screens/User/UserLearning"; // Dùng lại UserLearning ở đây nếu muốn

const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AccountScreen" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="AccountDetailed" component={AccountDetailed} options={{ title: "Hồ sơ cá nhân" }} />
      <Stack.Screen name="Setting" component={Setting} options={{ title: "Cài đặt" }} />
      <Stack.Screen name="Appearance" component={Appearance} options={{ title: "Giao diện" }} />
      <Stack.Screen name="Terms" component={Terms} options={{ title: "Điều khoản" }} />
      <Stack.Screen name="HelpAndFeedback" component={HelpAndFeedback} options={{ title: "Trợ giúp" }} />
      <Stack.Screen name="UserLearning" component={UserLearning} options={{ title: "Khóa học của tôi" }} />
    </Stack.Navigator>
  );
};
export default AccountStack;