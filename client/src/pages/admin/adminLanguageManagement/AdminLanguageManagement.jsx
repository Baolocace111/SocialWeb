import React, { useState } from "react";
import "./adminLanguageManagement.scss";
import enData from "../../../language/en.json";
import vnData from "../../../language/vn.json";
import jpData from "../../../language/jp.json";
import ReactJson from "react-json-view";
const AdminLanguageManagement = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [jsonData, setJsonData] = useState(enData);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    switch (language) {
      case "en":
        setJsonData(enData);
        break;
      case "vn":
        setJsonData(vnData);
        break;
      case "jp":
        setJsonData(jpData);
        break;
      default:
        setJsonData(enData);
        break;
    }
  };

  const handleAddTranslation = (newKey, newValue) => {
    setJsonData({ ...jsonData, [newKey]: newValue });
  };

  const handleEditTranslation = (key, newValue) => {
    setJsonData({ ...jsonData, [key]: newValue });
  };

  const handleDeleteTranslation = (key) => {
    const newData = { ...jsonData };
    delete newData[key];
    setJsonData(newData);
  };

  const handleSearchTranslation = (searchTerm) => {
    // Implement search logic here if needed
  };

  return (
    <div className="language-managent">
      <h1>Language Management</h1>
      <div>
        <button onClick={() => handleLanguageChange("en")}>English</button>
        <button onClick={() => handleLanguageChange("vn")}>Vietnamese</button>
        <button onClick={() => handleLanguageChange("jp")}>Japanese</button>
      </div>
      <ReactJson
        src={jsonData}
        onAdd={handleAddTranslation}
        onEdit={handleEditTranslation}
        onDelete={handleDeleteTranslation}
        onSearch={handleSearchTranslation}
      />
    </div>
  );
};
export default AdminLanguageManagement;
