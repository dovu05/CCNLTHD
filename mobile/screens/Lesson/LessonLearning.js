import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions, Keyboard } from "react-native";
import { useEffect, useState, useContext, useCallback } from "react";
import { ActivityIndicator, Avatar, Button, Card, Divider, Icon, TextInput } from "react-native-paper";
import RenderHtml from "react-native-render-html";
import { Video, ResizeMode } from "expo-av";
import { MyColorContext } from "../../utils/contexts/MyColorContext";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { MockApi } from "../../services/MockDataService"; // Dùng Mock

const LessonLearning = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const { width } = useWindowDimensions();
  const { theme } = useContext(MyColorContext);
  const [user] = useContext(MyUserContext);

  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Load nội dung bài học & Comment từ Mock Data
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Lấy chi tiết bài học (Giả lập: Lấy từ list lessons.json)
        // Vì trong mock service ta chưa viết hàm getLessonDetail, ta có thể dùng tạm hàm getLessons rồi find
        // Hoặc bạn có thể bổ sung hàm getLessonDetail vào MockDataService
        const resLessons = await MockApi.getLessons(1); // Param courseId tạm là 1 để lấy list
        const foundLesson = resLessons.data.results.find(l => l.id == lessonId) || resLessons.data.results[0];
        setLesson(foundLesson);

        // 2. Lấy comments
        const resComments = await MockApi.getComments(lessonId);
        setComments(resComments.data.results);
      } catch (error) {
        console.error("Lỗi load bài học:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [lessonId]);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      alert("Chúc mừng bạn đã hoàn thành bài học!");
    }
  }, []);

  const addComment = async () => {
    if (!content.trim()) return;
    try {
      const res = await MockApi.addComment(lessonId, content);
      setComments([res.data, ...comments]); // Thêm comment mới vào đầu list
      setContent("");
      Keyboard.dismiss();
    } catch (error) {
      console.error("Lỗi gửi comment:", error);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} color={theme.colors.primary} />;
  if (!lesson) return <Text className="p-5">Không tìm thấy bài học</Text>;

  return (
    <View className="flex-1 bg-white">
      {/* Video Player */}
      <View style={{ height: 220 }}>
        <YoutubePlayer
          height={220}
          play={playing}
          videoId={lesson.video_id || "gvkqT_Uoahw"} // Fallback video nếu null
          onChangeState={onStateChange}
        />
      </View>

      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-bold text-slate-800 mb-2">{lesson.subject}</Text>
        <Text className="text-slate-500 text-xs mb-4">Cập nhật lúc: {lesson.created_date}</Text>
        
        {/* Tab Description / Comments giả lập */}
        <View className="flex-row border-b border-slate-200 mb-4">
             <TouchableOpacity className="pb-2 border-b-2 border-blue-600 mr-6"><Text className="font-bold text-blue-600">Nội dung</Text></TouchableOpacity>
             <TouchableOpacity className="pb-2"><Text className="font-bold text-slate-400">Tài liệu</Text></TouchableOpacity>
        </View>

        <RenderHtml contentWidth={width} source={{ html: lesson.content || "<p>Nội dung đang cập nhật...</p>" }} />

        <Divider className="my-6" />

        {/* Comment Section */}
        <Text className="text-lg font-bold mb-4">Bình luận ({comments.length})</Text>
        
        {/* Input Comment */}
        <View className="flex-row items-center mb-6 gap-2">
            <Avatar.Image size={40} source={{ uri: user?.avatar || "https://i.pravatar.cc/100" }} />
            <TextInput
                mode="outlined"
                className="flex-1 bg-white h-10 text-sm"
                placeholder="Viết bình luận..."
                value={content}
                onChangeText={setContent}
                right={<TextInput.Icon icon="send" onPress={addComment} />}
            />
        </View>

        {/* List Comments */}
        {comments.map((c) => (
          <View key={c.id} className="flex-row mb-4 bg-slate-50 p-3 rounded-xl">
            <Avatar.Image size={36} source={{ uri: c.user.avatar }} className="mr-3" />
            <View className="flex-1">
              <Text className="font-bold text-slate-800 text-sm">{c.user.first_name} {c.user.last_name}</Text>
              <Text className="text-slate-600 mt-1">{c.content}</Text>
              <Text className="text-[10px] text-slate-400 mt-2">{MockApi.formatDate ? MockApi.formatDate(c.created_date) : c.created_date}</Text>
            </View>
          </View>
        ))}
        
        <View className="h-20" /> 
      </ScrollView>
    </View>
  );
};

export default LessonLearning;