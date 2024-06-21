import React, { useContext, useState } from "react";
import { LanguageContext } from "../../context/languageContext";
import "./languageSwitcher.scss";

const LanguageSwitcher = ({ text }) => {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);

  const languages = {
    en: { name: "English", flagImg: "/flags/Flag-United-Kingdom.webp" },
    vn: { name: "Tiếng Việt", flagImg: "/flags/Flag_of_Vietnam.svg.png" },
    jp: { name: "日本語", flagImg: "/flags/Flag_of_Japan.svg" },
  };

  const toggleDropdown = () => setOpen(!open);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    window.location.reload();
  };

  return (
    <div className="language-switcher">
      <div
        className={text ? "current text" : "current"}
        onClick={toggleDropdown}
      >
        <img src={languages[language].flagImg} alt={languages[language].name} />
        {text && <span> {languages[language].name}</span>}
      </div>
      {open && (
        <div className="dropdown">
          {Object.entries(languages).map(([lang, { name, flagImg }]) => (
            <div
              key={lang}
              className={text ? "option text" : "option"}
              onClick={() => handleLanguageChange(lang)}
            >
              <img src={flagImg} alt={name} /> {text && name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
