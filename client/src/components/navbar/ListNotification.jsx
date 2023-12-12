import { makeRequest } from "../../axios";
import "./listNotification.scss";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import moment from "moment";
import { Link } from "react-router-dom";
import NineCube from "../loadingComponent/nineCube/NineCube";
const ListNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ws, setWS] = useState(null);
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
  if (!ws) {
    const socket = new WebSocket(`ws://localhost:3030/index`);
    socket.onopen = () => {
      console.log("Connected");
    };
    socket.onmessage = async (event) => {
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
    };
    socket.onclose = () => {
      console.log("Closed");
    };
    setWS(socket);
  }
  return (
    <div className="list-notification">
      <div className="title-notification">
        <span>Thông báo</span>
        <div className="more">
          <MoreHorizIcon />
        </div>
      </div>
      {notifications.map((notification) => (
        <div className="item-notification" key={notification.id}>
          <Link to={notification.link} style={{ cursor: "pointer" }}>
            <img
              src={notification.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/notificationtype/null.jpg";
              }}
              alt={""}
            />
          </Link>
          <div className="content-notification">
            <div className="message" dangerouslySetInnerHTML={{ __html: notification.message }}></div>
            <div className="date">
              {moment(notification.createdAt).fromNow()}
            </div>
          </div>
          <div className="action-notification">
            <button onClick={() => handleDelete(notification.id)}>
              <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
            </button>
          </div>
        </div>
      ))}
      {loading && <NineCube />}
      {!loading && <button onClick={handleShowMore}>Show More</button>}
    </div>
  );
};

function removeDuplicateUnits(arr) {
  // Loại bỏ các phần tử trùng lặp dựa trên id
  const uniqueUnits = new Map();

  for (const unit of arr) {
    uniqueUnits.set(unit.id, unit);
  }

  // Chuyển mảng set thành mảng thông thường và sắp xếp theo createdAt tăng dần
  const sortedArr = Array.from(uniqueUnits.values()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Trả về mảng đã sắp xếp và không có phần tử trùng lặp
  return sortedArr;
}
export default ListNotification;
