import { View, Image, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel"; // Nếu project có dùng thư viện này
// Nếu không dùng thư viện carousel, có thể dùng ScrollView ngang đơn giản
import { MockApi } from "../../services/MockDataService";

const width = Dimensions.get("window").width;

export const HomeBanner = ({ theme }) => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
        try {
            const res = await MockApi.getBanners();
            setBanners(res.data.results);
        } catch(e) { console.log(e) }
    };
    fetchBanners();
  }, []);

  if (banners.length === 0) return null;

  // Render đơn giản dùng ScrollView nếu không muốn cài thêm lib
  // Ở đây giả định dùng Carousel như code gốc, nếu lỗi thư viện thì báo mình sửa thành ScrollView
  return (
    <View style={{ height: 180, width: "100%", marginBottom: 20 }}>
      <Carousel
        loop
        width={width}
        height={180}
        autoPlay={true}
        data={banners}
        scrollAnimationDuration={2000}
        renderItem={({ item }) => (
          <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}>
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%", borderRadius: 20 }}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
};