import "./message.scss";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { URL_OF_BACK_END } from "../../../axios";
import { useLanguage } from "../../../context/languageContext";
const Message = ({ messageShow, friendProfilePic }) => {
  const [show, setShow] = useState(false);
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") moment.locale("ja");
    if (language === "vn") moment.locale("vi");
    else moment.locale("en");
  }, []);
  useEffect(() => {
    let timeoutId;

    if (show) {
      // Nếu show là true, đặt timeout để chuyển show về false sau 2 giây
      timeoutId = setTimeout(() => {
        setShow(false);
      }, 2000);
    }

    // Clear timeout khi component unmount hoặc show thay đổi
    return () => clearTimeout(timeoutId);
  }, [show]);

  const handleShow = () => {
    setShow(true);
  };
  return (
    <div className="messageContainer" onClick={handleShow}>
      {messageShow.is_yours ? (
        <div className="messageis_yours">
          <div className="mess-content">{messageShow.message}</div>
          {show && (
            // <span className="date">{moment(messageShow.created_at).fromNow()}</span>
            <span className="date">
              {moment
                .utc(messageShow.created_at)
                .add(7, "hours")
                .local()
                .format("dddd, Do YYYY h:mm:ss a")}
            </span>
          )}
        </div>
      ) : (
        <div className="messageis_friends">
          <img
            src={URL_OF_BACK_END + `users/profilePic/` + friendProfilePic}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt={""}
          />
          <div className="content-and-date">
            <div className="mess-content">{messageShow.message}</div>
            {show && (
              <span className="date">
                {moment
                  .utc(messageShow.created_at)
                  .add(7, "hours")
                  .local()
                  .format("dddd, Do YYYY h:mm:ss a")}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Message;
