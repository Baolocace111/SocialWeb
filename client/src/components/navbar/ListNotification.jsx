import { makeRequest } from "../../axios";
import "./navbar.scss";
import { useCallback, useState } from "react";
import moment from "moment";
const ListNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(true);
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
  if (loading) fetchNotifications();
  return (
    <div style={{ width: "300px", height: "500px" }}>
      {notifications.map((notification) => (
        <div style={{ display: "flex", margin: "15px 10px" }} key={notification.id}>
          <div style={{ display: "flex", alignItems: "center", marginRight: "15px", flex: "0 0 auto" }}>
            <img
              style={{ borderRadius: "50%", width: "50px", height: "50px" }}
              src={"/notificationtype/" + notification.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/notificationtype/null.jpg";
              }}
              alt={""}
            />
          </div>
          <div className="content">
            <div
              className="message"
              dangerouslySetInnerHTML={{ __html: notification.message }}
            ></div>
            <div className="date">
              {moment(notification.createdAt).fromNow()}
            </div>
          </div>
          <div></div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
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
