import { useState } from "react";
import "./fileBox.scss";
import { URL_OF_BACK_END } from "../../../axios";
const FileBox = ({ type, path }) => {
  const [origin, setOrigin] = useState(null);
  return (
    <div className="fileBox">
      <div className="mainimage">
        {type === "image" ? (
          <img
            src={`${URL_OF_BACK_END}admin/files/getImage?path=${path}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/upload/errorImage.png";
            }}
            alt=""
          ></img>
        ) : (
          <video
            controls
            src={`${URL_OF_BACK_END}admin/files/getImage?path=${path}`}
          ></video>
        )}
      </div>
    </div>
  );
};
export default FileBox;
