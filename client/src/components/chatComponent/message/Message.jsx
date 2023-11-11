import "./message.scss";
import React, { useState, useEffect } from "react";
import moment from "moment";
const Message = ({ messageShow }) => {
  const [show, setShow] = useState(false);

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
    <div onClick={handleShow}>
      {messageShow.is_yours ? (
        <div className="messageis_yours">
          <div className="mess-content">{messageShow.message}</div>
        </div>
      ) : (
        <div className="messageis_friends">
          <div className="mess-content">{messageShow.message}</div>
        </div>
      )}
      {show && (
        <span className="date">{moment(messageShow.created_at).fromNow()}</span>
      )}
    </div>
  );
};
export default Message;