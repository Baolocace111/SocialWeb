import "./message.scss";
import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { useLanguage } from "../../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faReply } from "@fortawesome/free-solid-svg-icons";
import ShowImageMessage from "../showImageMessage/ShowImageMessage";

const Message = ({
  messageShow,
  friendProfilePic,
  showAvatar,
  reload,
  setError,
  selectMessage,
  replyMessage,
  scrollTo,
  setLoading,
}) => {
  const [show, setShow] = useState(false);
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") {
      moment.locale("ja");
    } else if (language === "vn") {
      moment.locale("vi");
    } else {
      moment.locale("en");
    }
  }, [language]);

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
  const isDelete = {
    type: messageShow.isdelete ? true : false,
    message:
      messageShow.isdelete === 1
        ? trl("message is revoked")
        : messageShow.isdelete === 2
        ? trl("message is denied")
        : "",
  };
  const handleEnvictOrDeny = () => {
    if (window.confirm(trl("Are you sure to delete this message"))) {
      if (messageShow.is_yours) {
        setLoading(true);
        makeRequest
          .delete("/messages/evict/" + messageShow.id)
          .then((res) => {
            setError(trl("Successful"));
            reload();
            setLoading(false);
          })
          .catch((error) => {
            setError(
              trl("Failed to handle messages:") + trl(error.response?.data)
            );
            setLoading(false);
          });
      } else {
        setLoading(true);
        makeRequest
          .delete("/messages/deny/" + messageShow.id)
          .then((res) => {
            setError(trl("Successful"));
            reload();
            setLoading(false);
          })
          .catch((error) => {
            setError(
              trl("Failed to handle messages:") + trl(error.response?.data)
            );
            setLoading(false);
          });
      }
    }
  };
  return (
    <div
      className={
        "messageContainer" + (messageShow.is_yours ? " messagerevese" : "")
      }
      onClick={handleShow}
      onDoubleClick={selectMessage}
    >
      {messageShow.is_yours ? (
        <div className={"messageis_yours" + (isDelete.type ? " isdel" : "")}>
          <div className="mess-content">
            {messageShow.replyid && (
              <span
                onClick={() => {
                  scrollTo(messageShow.replyid);
                }}
              >
                {replyMessage?.image ? (
                  <ShowImageMessage
                    id={replyMessage?.id}
                    image={replyMessage?.image}
                  />
                ) : replyMessage?.isdelete ? (
                  replyMessage?.isdelete === 1 ? (
                    trl("message is revoked")
                  ) : replyMessage?.isdelete === 2 ? (
                    trl("message is denied")
                  ) : (
                    ""
                  )
                ) : (
                  replyMessage?.message
                )}
              </span>
            )}
            {messageShow.image ? (
              <ShowImageMessage id={messageShow.id} image={messageShow.image} />
            ) : isDelete.type ? (
              isDelete.message
            ) : (
              messageShow.message
            )}
          </div>
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
      ) : (
        <div className={"messageis_friends" + (isDelete.type ? " isdel" : "")}>
          <div className={showAvatar ? "avatar" : "avatar placeholder"}>
            {showAvatar ? (
              <img
                src={URL_OF_BACK_END + `users/profilePic/` + friendProfilePic}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
                alt={""}
              />
            ) : null}
          </div>
          <div className="content-and-date">
            <div className="mess-content">
              {messageShow.replyid && (
                <span
                  onClick={() => {
                    scrollTo(messageShow.replyid);
                  }}
                >
                  {replyMessage?.image ? (
                    <ShowImageMessage
                      id={replyMessage?.id}
                      image={replyMessage?.image}
                    />
                  ) : replyMessage?.isdelete ? (
                    replyMessage?.isdelete === 1 ? (
                      trl("message is revoked")
                    ) : replyMessage?.isdelete === 2 ? (
                      trl("message is denied")
                    ) : (
                      ""
                    )
                  ) : (
                    replyMessage?.message
                  )}
                </span>
              )}
              <div>
                {messageShow.image ? (
                  <ShowImageMessage
                    id={messageShow.id}
                    image={messageShow.image}
                  />
                ) : isDelete.type ? (
                  isDelete.message
                ) : (
                  messageShow.message
                )}
              </div>
            </div>
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
      {!isDelete.type && (
        <div className="actionbutton">
          {/* <div onClick={selectMessage}>
            <FontAwesomeIcon icon={faReply}></FontAwesomeIcon>
          </div> */}
          <div onClick={handleEnvictOrDeny}>
            <FontAwesomeIcon icon={faBan}></FontAwesomeIcon>
          </div>
        </div>
      )}
    </div>
  );
};
export default Message;
