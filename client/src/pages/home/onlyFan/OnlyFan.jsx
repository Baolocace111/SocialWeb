import React, { useState, useEffect } from "react";
import "./onlyFan.scss";
import PopupWindow from "../../../components/PopupComponent/PopupWindow";
import { useLanguage } from "../../../context/languageContext";
import { useRef } from "react";
const OnlyFanPage = () => {
  const [popup, setPopup] = useState(true);
  const [speed, setSpeed] = useState(0);
  const { trl } = useLanguage();

  const audioRef = useRef(null);

  useEffect(() => {
    // Cập nhật class dựa trên tốc độ quay
    const fanBlades = document.querySelector(".fan-blades");
    if (fanBlades) {
      fanBlades.className = `fan-blades speed-${speed}`;
    }
    handleVolumeChange(speed);
    if (audioRef.current.paused) {
      audioRef.current.play();
    }
  }, [speed]);
  const handleAudioEnded = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };
  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  // Hàm để xử lý thay đổi âm lượng
  const handleVolumeChange = (speed) => {
    const newVolume = speed * 0.3;
    audioRef.current.volume = newVolume;
  };

  return (
    <div className="fanpage">
      <audio ref={audioRef} onEnded={handleAudioEnded} autoPlay={false}>
        <source src="upload/faneffect.mp3" type="audio/mpeg" />
      </audio>
      <PopupWindow show={popup}>
        <div className="popup-content">
          <img src="/upload/18.png" alt=""></img>
          <h1>{trl("sure1-8")}</h1>
          <div className="acbutton">
            <button
              onClick={() => {
                setPopup(false);
              }}
            >
              {trl("Yes")}
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
            >
              {trl("No")}
            </button>
          </div>
        </div>
      </PopupWindow>
      <div className="fan">
        <div className="fan-main">
          <div className="bottom">
            <div
              className={"btn-0" + (speed === 0 ? " down" : "")}
              onClick={() => setSpeed(0)}
            >
              {" "}
            </div>
            <div
              className={"btn-1" + (speed === 1 ? " down" : "")}
              onClick={() => setSpeed(1)}
            >
              <h1>1</h1>
            </div>
            <div
              className={"btn-2" + (speed === 2 ? " down" : "")}
              onClick={() => setSpeed(2)}
            >
              <h1>2</h1>
            </div>
            <div
              className={"btn-3" + (speed === 3 ? " down" : "")}
              onClick={() => setSpeed(3)}
            >
              <h1>3</h1>
            </div>
          </div>
        </div>
        <div className="fan-stand"></div>

        <div className="head">
          <label htmlFor="start" className="green"></label>
          <div className="engine">
            <span className="center"></span>
          </div>
          <div className="fan-blades">
            <span className="center"></span>
            <div className="blade">
              <span></span>
            </div>
            <div className="blade">
              <span></span>
            </div>
            <div className="blade">
              <span></span>
            </div>
            <div className="blade">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlyFanPage;
