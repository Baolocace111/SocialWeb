import { makeRequest } from "../../axios";
import "./navbar.scss";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
    <div style={{ width: "300px", height: "500px" }}>
      {notifications.map((notification) => (
        <div
          style={{
            display: "flex",
            margin: "15px 10px",
            padding: "10px",
            // background: notification.read === 1 ? "white" : "grey",
          }}
          key={notification.id}
        >
          <Link
            to={notification.link}
            style={{ cursor: "pointer", display: "flex" }}
            target="_blank"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "15px",
                flex: "0 0 auto",
              }}
            >
              <img
                style={{ borderRadius: "50%", width: "50px", height: "50px" }}
                src={notification.image}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/notificationtype/null.jpg";
                }}
                alt={""}
              />
            </div>
          </Link>
          <div className="content">
            <div
              className="message"
              dangerouslySetInnerHTML={{ __html: notification.message }}
            ></div>
            <div className="date">
              {moment(notification.createdAt).fromNow()}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              right: "0px",
              width: "50px",
            }}
          >
            <button
              onClick={() => handleDelete(notification.id)}
              style={{
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
              }}
            >
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
