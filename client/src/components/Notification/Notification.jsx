import "./notification.scss";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import { Link } from "react-router-dom";
import moment from "moment";
import { useLanguage } from "../../context/languageContext";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faHeart,
  faUserPlus,
  faExclamation,
  faUserTie,
  faRecycle,
  faHandshake,
  faUserSlash,
  faHandshakeSimpleSlash,
  faNewspaper,
  faTextSlash,
} from "@fortawesome/free-solid-svg-icons";
import { URL_OF_BACK_END, makeRequest } from "../../axios";
const NotificationTab = ({ notification, removeItemById }) => {
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") moment.locale("ja");
    if (language === "vn") moment.locale("vi");
    else moment.locale("en");
  }, [language]);
  const handleDelete = (id) => {
    makeRequest
      .delete("/notifications/" + id)
      .then((res) => {
        removeItemById(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const contentdata = (() => {
    try {
      return JSON.parse(notification.message);
    } catch (e) {
      return { message: notification.message };
    }
  })();
  const contentMessage = (() => {
    const { notitype } = notification;
    const {
      userId = "",
      name = "",
      type = "",
      message = "",
      groupname = "",
      groupId = "",
    } = contentdata || {};

    switch (notitype) {
      case null:
        return "";
      case -1:
        return message;
      case 0:
        return `<a target="_blank" href="/profile/${userId}">${name}</a> ${
          type === 1
            ? trl("đã thích bài viết bạn đã chia sẻ")
            : trl("đã thích bài viết của bạn")
        }`;
      case 1:
        return `<a target="_blank" href="/profile/${userId}">${name}</a> ${trl(
          "đã chấp nhận lời mời kết bạn của bạn"
        )}`;
      case 2:
        // Add case 2 handling here
        return trl(
          "Cảnh báo: Chúng tôi vừa xóa 1 bài viết vi phạm tiêu chuẩn cộng đồng của bạn"
        );
      case 3:
        // Add case 3 handling here
        return trl(
          "Báo cáo của bạn đang được xem xét. Xin cảm ơn vì đã báo cáo"
        );
      case 4:
        // Add case 4 handling here
        return (
          trl("Báo cáo của bạn đã được xử lý. Xin cảm ơn") + ` - "${message}"`
        );
      case 5:
        // Add case 5 handling here
        return (
          `<a target="_blank" href="/groups/${groupId}"> ${groupname}</a>` +
          ": " +
          trl("Yêu cầu tham gia của bạn đã được chấp thuận")
        );
      case 6:
        // Add case 6 handling here
        return (
          `<a target="_blank" href="/groups/${groupId}"> ${groupname}</a>` +
          ": " +
          trl("Yêu cầu tham gia của bạn bị từ chối")
        );
      case 7:
        // Add case 7 handling here
        return (
          `<a target="_blank" href="/groups/${groupId}"> ${groupname}</a>` +
          ": " +
          trl("Bài viết của bạn đã được phê duyệt")
        );
      case 8:
        return (
          `<a target="_blank" href="/groups/${groupId}"> ${groupname}</a>` +
          ": " +
          trl("Bài viết của bạn đã bị từ chối")
        );
      default:
        return "";
    }
  })();
  return (
    <div className="item-notification" key={notification.id}>
      <Link
        className="notificationImage"
        to={notification.link}
        style={{ cursor: "pointer" }}
      >
        <img
          src={
            notification.link?.includes("/seepost/") ||
            notification.link?.includes("/profile/")
              ? `${URL_OF_BACK_END}users/profilePic/${notification.interactionId}`
              : notification.link?.includes("/groups/")
              ? `${URL_OF_BACK_END}groups/${notification.interactionId}/avatar`
              : "/notificationtype/null.jpg"
          }
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/notificationtype/null.jpg";
          }}
          alt={""}
        />
        <NotificationIcon type={notification.notitype}></NotificationIcon>
      </Link>
      <div className="content-notification">
        <div
          className="message"
          dangerouslySetInnerHTML={{ __html: contentMessage }}
        ></div>
        <div className="date">{moment(notification.createdAt).fromNow()}</div>
      </div>
      <div className="action-notification">
        <button onClick={() => handleDelete(notification.id)}>
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );
};
const NotificationIcon = ({ type }) => {
  const icon = (() => {
    switch (Number(type)) {
      case -1:
        return null;
      case 0:
        return faHeart;
      case 1:
        return faUserPlus;
      case 2:
        return faExclamation;
      case 3:
        return faUserTie;
      case 4:
        return faRecycle;
      case 5:
        return faHandshake;
      case 6:
        return faHandshakeSimpleSlash;
      case 7:
        return faNewspaper;
      case 8:
        return faTextSlash;

      default:
        return null;
    }
  })();
  return (
    <div className={`notiIcon color-${type}`}>
      <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
    </div>
  );
};
export default NotificationTab;
