import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";

const LanguageButton: FC = () => {
  const { i18n } = useTranslation();

  const [isIndonesian, setIsIndonesian] = useState(i18n.language === "id");

  const handleToggle = () => {
    const newLang = isIndonesian ? "en-US" : "id";
    i18n.changeLanguage(newLang);
    setIsIndonesian(!isIndonesian);
  };

  return (
    <>
      <input
        type="checkbox"
        id="toggle"
        className="toggleCheckbox"
        checked={isIndonesian}
        onChange={handleToggle}
      />
      <label htmlFor="toggle" className="languageButton">
        <div>EN</div>
        <div>ID</div>
      </label>
    </>
  );
};

export { LanguageButton };
