import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user_info';

export const saveTokens = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error("Lỗi lưu token", e);
  }
};

export const getTokens = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token ? { access_token: token } : null;
  } catch (e) {
    return null;
  }
};

export const removeTokens = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Lỗi xóa token", e);
  }
};

export const saveUser = async (user) => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) { console.error(e); }
};

export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch(e) { return null; }
};