import { createContext, useContext, useState } from "react";
import PopupWindow from "../components/PopupComponent/PopupWindow";
import "./loadingContext.scss";
import { useLanguage } from "./languageContext";
import BallInBar from "../components/loadingComponent/ballInBar/BallInBar";
export const LoadingContext = createContext();
export const LoadingProvider = ({ children }) => {
  const [isContextLoading, setContextLoading] = useState(false);
  const [isContextPopup, setContextPopup] = useState(false);
  const [ContextContentPopup, setContextContentPopup] = useState("");
  const [type, setType] = useState(0);
  const [handleContextYes, setHandleYes] = useState(() => {});
  const [handleContextNo, setHandleNo] = useState(() => {});
  const [handleContextOk, setHandleOk] = useState(() => {});
  const { trl } = useLanguage();
  const closePopup = () => {
    setContextPopup(false);
    setType(0);
  };
  const openContextPopup = (content, type, func1, func2) => {
    if (type === "ok") {
      setType(1);
      setHandleOk(() => func1); // Đảm bảo rằng func1 được thiết lập đúng cách
    } else {
      setType(2);
      setHandleYes(() => func1);
      setHandleNo(() => func2);
    }
    setContextContentPopup(content);
    setContextPopup(true);
  };

  return (
    <LoadingContext.Provider
      value={{ setContextLoading, openContextPopup, closePopup }}
    >
      <div className="loadingcontext">
        <PopupWindow handleClose={() => {}} show={isContextPopup}>
          <div className="popup-content">
            <h1>{ContextContentPopup && ContextContentPopup}</h1>
            <div className="button-box">
              {type === 1 ? (
                <button onClick={handleContextOk}>{trl("OK")}</button>
              ) : type === 2 ? (
                <div>
                  <button onClick={handleContextYes}>{trl("Yes")}</button>
                  <button onClick={handleContextNo}>{trl("No")}</button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </PopupWindow>

        {isContextLoading && (
          <div className="pageloading">
            <BallInBar></BallInBar>
          </div>
        )}
      </div>
      {children}
    </LoadingContext.Provider>
  );
};
export const useLoadingContext = () => {
  return useContext(LoadingContext);
};
