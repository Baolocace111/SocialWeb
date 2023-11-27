import React from "react";
import "./popup.scss";
import { useRef } from "react";
import { useEffect } from "react";
const PopupWindow = ({ handleClose, show, children }) => {
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show]);
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <>
      <div className={showHideClassName}>
        <div className="modal-main" ref={modalRef}>
          {children}
        </div>
      </div>
    </>
  );
};

export default PopupWindow;
