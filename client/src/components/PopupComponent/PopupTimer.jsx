import { useRef } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import "./popuptimer.scss";
const PopupTimer = ({ time, setTime, children }) => {
  const modalRef = useRef(null);
  const handleOutsideClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setTime(0);
      }
    },
    [setTime]
  );
  useEffect(() => {
    // Giảm thời gian mỗi giây
    const timer = time > 0 && setInterval(() => setTime(time - 1), 1000);
    // Dọn dẹp khi component unmount hoặc thời gian hết
    return () => clearInterval(timer);
  }, [time]);
  useEffect(() => {
    if (time > 0) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [time, handleOutsideClick]);
  return (
    <div
      className={
        time > 0 ? "timemodal display-block" : "timemodal display-none"
      }
    >
      <div
        className="timer-progress-bar"
        style={{ width: `${(time / 10) * 100}%` }}
      ></div>
      <div className="timemodal-main" ref={modalRef}>
        {children}
      </div>
    </div>
  );
};
export default PopupTimer;
