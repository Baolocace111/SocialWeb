import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import ChatContextProvider from "./components/navbar/ChatContext";
import { LanguageProvider } from "./context/languageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DarkModeContextProvider>
      <LanguageProvider>
        <AuthContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </AuthContextProvider>
      </LanguageProvider>
    </DarkModeContextProvider>
  </React.StrictMode>
);
