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
    return translations[key] || key;
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
