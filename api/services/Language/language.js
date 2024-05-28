import en from "./en.json" assert { type: "json" };
import vn from "./vn.json" assert { type: "json" };
import jp from "./jp.json" assert { type: "json" };

const translationsMap = {
  en,
  vn,
  jp,
};

export const trl = (key, language) => {
  // Lấy tệp dịch tương ứng với ngôn ngữ hiện tại
  const translations = translationsMap[language];
  if (translations) {
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
  } else {
    return key;
  }
};
