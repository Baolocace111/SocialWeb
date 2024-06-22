import { useState } from "react";
import "./fileBox.scss";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../context/languageContext";
import { useQueryClient } from "@tanstack/react-query";
const FileBox = ({ type, path, page }) => {
  const [origin, setOrigin] = useState(null);
  const { trl } = useLanguage();
  const handleGetSource = () => {
    if (!origin) {
      makeRequest
        .post("/admin/files/origin", { filepath: path })
        .then((res) => {
          setOrigin(res.data[0].name + ":" + res.data[0].id);
        })
        .catch((e) => {
          setOrigin(trl(e.response.data));
        });
    }
  };
  const queryClient = useQueryClient();
  const handleDeleteFile = () => {
    if (window.confirm(trl("Are you sure to DELETE this file?"))) {
      // User clicked "OK" (Yes)
      makeRequest
        .delete("/admin/files/delete", { data: { path: path } })
        .then((res) => {
          queryClient.invalidateQueries([type, page]);
          alert(trl("Deleted"));
        })
        .catch((e) => {
          alert(trl(e.response.data));
        });
    } else {
      // User clicked "Cancel" (No)
    }
  };
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
          />
        ) : (
          <video
            controls
            src={`${URL_OF_BACK_END}admin/files/getImage?path=${path}`}
          ></video>
        )}
      </div>
      <div className="float-file-button">
        <button className="deleteButton" onClick={handleDeleteFile}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <div className="source">
          <button className="sourceButton" onClick={handleGetSource}>
            {trl("Source")}
          </button>
          {origin && <div className="originText">{origin}</div>}
        </div>
      </div>
    </div>
  );
};
export default FileBox;
