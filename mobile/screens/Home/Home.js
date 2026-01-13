import { View, Text, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Icon, Avatar } from "react-native-paper";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { CourseContext } from "../../utils/contexts/CoursesContext";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { HomeBanner } from "../../components/HomeComponents/HomeBanner";
import { HomeCourseList } from "../../components/HomeComponents/HomeCourseList";
import HomePromotion from "../../components/HomeComponents/HomePromotion"; // Đã có file này
import { HomeCategories } from "../../components/HomeComponents/HomeCategories";

const HomeScreen = ({ navigation }) => {
  const { theme } = useContext(MyColorContext);
  const { courses, ensureCourses } = useContext(CourseContext);
  const [user] = useContext(MyUserContext);

  const courseFree = useMemo(() => courses.filter((c) => (c?.price ?? 0) <= 0), [courses]);
  const courseExpensive = useMemo(() => courses.filter((c) => (c?.price ?? 0) >= 10000), [courses]);

  useEffect(() => { ensureCourses(); }, [ensureCourses]);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="pt-14 px-6 pb-4 bg-white shadow-sm z-10">
        <View className="flex-row justify-between items-center mb-4">
          <View>
             <Text className="text-slate-400 font-medium text-sm">Chào buổi sáng,</Text>
             <Text className="text-2xl font-black text-slate-800">{user?.last_name || "Bạn mới"} 👋</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("AccountTab")}>
             <Avatar.Image size={44} source={{ uri: user?.avatar || "https://i.pravatar.cc/300" }} className="bg-slate-200" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate("SearchTab")}
          className="flex-row items-center bg-slate-100 p-3 rounded-2xl border border-slate-200"
        >
           <Icon source="magnify" size={24} color={theme.colors.slate[400]} />
           <Text className="ml-3 text-slate-400 font-medium">Bạn muốn học gì?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mt-6"><HomeBanner theme={theme} /></View>
        <View className="mt-2 mb-2"><HomeCategories theme={theme} /></View>
        
        <View className="mt-4 bg-transparent pl-2">
           <HomeCourseList
              data={courseFree}
              text="Khóa học miễn phí"
              icon="fire"
              iconColor="#f59e0b"
              theme={theme}
           />
        </View>

        <HomePromotion />

        <View className="mt-2 mb-20 pl-2">
           <HomeCourseList
              data={courseExpensive}
              text="Dành cho chuyên gia"
              icon="star-four-points"
              iconColor="#7c3aed"
              theme={theme}
           />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;