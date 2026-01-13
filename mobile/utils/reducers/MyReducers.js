import { removeTokens } from "../tokenUtils";

const MyReducers = (currentState, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      removeTokens(); // Xóa token khi đăng xuất
      return null;
    case "update":
       return { ...currentState, ...action.payload };
    default:
      return currentState;
  }
};

export default MyReducers;