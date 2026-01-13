import { ScrollView, Text, View } from "react-native";
import termsData from "../../mock/data.config.terms.json";

const Terms = () => {
  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold text-blue-600 mb-4">Điều khoản sử dụng</Text>
      {termsData.map((item, index) => (
        <View key={index} className="mb-4">
          <Text className="font-bold text-lg text-slate-800 mb-1">{index + 1}. {item.title}</Text>
          <Text className="text-slate-600 leading-6 text-justify">{item.content}</Text>
        </View>
      ))}
      <View className="h-10"/>
    </ScrollView>
  );
};
export default Terms;