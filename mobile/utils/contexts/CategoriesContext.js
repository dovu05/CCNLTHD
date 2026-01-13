import { createContext, useState, useEffect } from "react";
import { MockApi } from "../../services/MockDataService"; // Dùng Mock Service

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // THAY ĐỔI: Gọi Mock API
        const res = await MockApi.getCategories();
        setCategories(res.data.results);
      } catch (error) {
        console.error("Lỗi tải Categories (Mock):", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {children}
    </CategoriesContext.Provider>
  );
};