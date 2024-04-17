import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
export const LanguageContext = createContext();

// Tạo Provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Lấy ngôn ngữ từ Local Storage nếu có, nếu không mặc định là 'en'
    return localStorage.getItem("language") || "en";
  });

  useEffect(() => {
    // Lưu ngôn ngữ vào Local Storage khi có sự thay đổi
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const trl = (key) => {
    // Lấy tệp dịch tương ứng với ngôn ngữ hiện tại
    const translations = require(`../language/${language}.json`);
    if (typeof key === "string") {
      // Nếu key là một chuỗi, trả về bản dịch tương ứng hoặc key nếu không có bản dịch
      return translations[key] || key;
    } else if (Array.isArray(key)) {
      // Nếu key là một mảng, xử lý mỗi phần tử trong mảng và dịch
      return key.map((k) => translations[k] || k).join(" ");
    } else {
      // Trường hợp khác, trả về key ban đầu
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, trl }}>
      {children}
    </LanguageContext.Provider>
  );
};
export const useLanguage = () => {
  return useContext(LanguageContext);
};
