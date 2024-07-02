import "./showImageMessage.scss";
import { URL_OF_BACK_END } from "../../../axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
const ShowImageMessage = ({ image, id }) => {
  const [fullscreen, SetFullscreen] = useState(false);
  const handleFullScreen = () => {
    SetFullscreen(!fullscreen);
  };
  const isVideoContent = image
    ? image.endsWith(".mp4") || image.endsWith(".avi") || image.endsWith(".mov")
    : false;
  return (
    <div className="imagefrommessage">
      {fullscreen && (
        <div className="fullscreen">
          <button onClick={handleFullScreen}>
            <FontAwesomeIcon icon={faX} color="red"></FontAwesomeIcon>
          </button>
          {!isVideoContent ? (
            <img
              src={URL_OF_BACK_END + `messages/image/` + id}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/upload/errorImage.png";
              }}
              alt={URL_OF_BACK_END + `messages/image/` + id}
            ></img>
          ) : (
            <video
              controls
              src={URL_OF_BACK_END + `messages/image/` + id}
            ></video>
          )}
        </div>
      )}
      <div onClick={handleFullScreen}>
        {!isVideoContent ? (
          <img
            src={URL_OF_BACK_END + `messages/image/` + id}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt={URL_OF_BACK_END + `messages/image/` + id}
          ></img>
        ) : (
          <video
            controls
            src={URL_OF_BACK_END + `messages/image/` + id}
          ></video>
        )}
      </div>
    </div>
  );
};
export default ShowImageMessage;
