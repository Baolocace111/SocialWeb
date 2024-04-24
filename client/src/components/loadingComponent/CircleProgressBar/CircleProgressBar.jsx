import "./circleProgressBar.scss";
import { useEffect, useState } from "react";
import { makeRequest } from "../../../axios";
import { useLanguage } from "../../../context/languageContext";
const CircleProgressBar = ({ handleClose }) => {
  const { trl } = useLanguage();
  const [error, setError] = useState(null);
  const handleOnClick = () => {
    if (percentage >= 100) handleClose();
  };
  const [percentage, setPercentage] = useState(0); // Tỉ lệ mặc định là 80%
  useEffect(() => {
    const interval = setInterval(() => {
      // Kiểm tra nếu tỉ lệ đã đạt 95% thì không tăng nữa
      if (percentage >= 95 || percentage < 0) {
        clearInterval(interval); // Dừng interval
      } else {
        // Tăng tỉ lệ lên 5% nhưng không vượt quá 95%

        setPercentage((prevPercentage) =>
          Math.min(prevPercentage + Math.floor(Math.random() * 10) + 1, 95)
        );
      }
    }, 2000);
    makeRequest
      .get("/auth/check")
      .then((res) => {
        setPercentage(100);
      })
      .catch((error) => {
        setError(JSON.stringify(error));
        setPercentage(-100);
      })
      .finally(() => {
        clearInterval(interval);
      });
    return () => clearInterval(interval); // Xóa interval khi component bị unmount
  }, []);

  useEffect(() => {
    // Tính toán giá trị cho stroke-dashoffset dựa trên tỉ lệ mới
    const circle = document.querySelector(".percent svg circle:nth-child(2)");
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }, [percentage]);
  return (
    <div className="bodycircleProgressBar ">
      <div className="container">
        <div className="card">
          <div className="box">
            <div className="percent" onClick={handleOnClick}>
              <svg>
                <circle cx="70" cy="70" r="70"></circle>
                <circle cx="70" cy="70" r="70"></circle>
              </svg>
              <div className={percentage < 0 ? "num red" : "num"}>
                {percentage < 0 ? (
                  <h2>{trl("Có lỗi xảy ra")}</h2>
                ) : (
                  <h2>
                    {percentage >= 100 ? trl("GO") : percentage}
                    <span> {percentage >= 100 ? "" : "%"}</span>
                  </h2>
                )}
              </div>
            </div>
            <h2 className="text">TinySocial</h2>
            {/* <h2>{error && error}</h2> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CircleProgressBar;
