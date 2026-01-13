import { ScrollView, View } from "react-native";
import { List } from "react-native-paper";
import faqData from "../../mock/data.config.faq.json";

const HelpAndFeedback = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <List.Section title="Câu hỏi thường gặp" titleStyle={{ fontWeight: 'bold', fontSize: 18, color: '#2563eb' }}>
        {faqData.map((item) => (
          <List.Accordion
            key={item.id}
            title={item.question}
            left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
            className="bg-white border-b border-slate-100"
          >
            <List.Item 
                title={item.answer} 
                titleNumberOfLines={10} 
                titleStyle={{ color: '#64748b', fontSize: 14 }}
                className="bg-slate-50 pl-4"
            />
          </List.Accordion>
        ))}
      </List.Section>
    </ScrollView>
  );
};
export default HelpAndFeedback;