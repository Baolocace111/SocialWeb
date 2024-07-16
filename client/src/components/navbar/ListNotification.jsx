import { URL_OF_BACK_END, makeRequest } from "../../axios";
import "./listNotification.scss";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import moment from "moment";
import { Link } from "react-router-dom";
import NineCube from "../loadingComponent/nineCube/NineCube";
import { useLanguage } from "../../context/languageContext";
import { useEffect } from "react";
import { useRef } from "react";
import "moment/locale/ja"; // Import locale for Japanese
import "moment/locale/vi"; // Import locale for Vietnamese
import NotificationTab from "../Notification/Notification";
const ListNotification = () => {
  const { trl, language } = useLanguage();
  useEffect(() => {
    if (language === "jp") moment.locale("ja");
    if (language === "vn") moment.locale("vi");
    else moment.locale("en");
  }, [language]);
  useEffect(() => {
    if (!wsRef.current) {
      const socket = new WebSocket(`ws://localhost:3030/index`);
      socket.onopen = () => {
        console.log("Connected");
        wsRef.current = socket;
      };
      socket.onmessage = async (event) => {
        if (wsRef.current) {
          if (event.data === "New notification") {
            try {
              const res = await makeRequest.get(`/notifications/see/1`);
              setNotifications(
                removeDuplicateUnits([...notifications, ...res.data])
              );
            } catch (error) {
              console.error("Failed to fetch friends:", error);
            }
          }
        }
      };
      socket.onclose = () => {
        wsRef.current = null;
        console.log("Closed");
      };
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);
  const [notifications, setNotifications] = useState([]);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(true);
  //const [ws, setWS] = useState(null);
  const wsRef = useRef(null);
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await makeRequest.get(`/notifications/see/${offset}`);
      setNotifications(removeDuplicateUnits([...notifications, ...res.data]));
      if (res.data !== 0) setOffset(offset + 1);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  }, [offset, notifications]);
  const handleShowMore = () => {
    fetchNotifications();
  };
  const removeItemById = (idToRemove) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id !== idToRemove)
    );
  };
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
  if (loading) fetchNotifications();

  return (
    <div className="list-notification">
      <div className="title-notification">
        <span>{trl("Thông báo")}</span>
        {/* <div className="more">
          <MoreHorizIcon />
        </div> */}
      </div>
      {notifications.map((notification) => (
        <NotificationTab
          notification={notification}
          key={notification.id}
          removeItemById={removeItemById}
        ></NotificationTab>
      ))}
      {loading && <NineCube />}
      {!loading && <button onClick={handleShowMore}>{trl("Show More")}</button>}
    </div>
  );
};

function removeDuplicateUnits(arr) {
  // Loại bỏ các phần tử trùng lặp dựa trên id
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  // Chuyển mảng set thành mảng thông thường và sắp xếp theo createdAt giảm dần
  const sortedArr = Array.from(uniqueUnits.values()).sort(
    (a, b) => -new Date(a.createdAt) + new Date(b.createdAt)
  );

  // Trả về mảng đã sắp xếp và không có phần tử trùng lặp
  return sortedArr;
}
export default ListNotification;
