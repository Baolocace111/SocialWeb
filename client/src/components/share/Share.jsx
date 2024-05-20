import "./share.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faFaceSmileBeam,
  faX,
  faGlobe,
  faUserGroup,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../axios";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useLanguage } from "../../context/languageContext";
import BallInBar from "../loadingComponent/ballInBar/BallInBar";
import { Tooltip } from "@mui/material";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const { trl } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);
  const [clickedInside, setClickedInside] = useState(false);
  const [posting, setPosting] = useState(false);
  const [privateMode, setPrivateMode] = useState(0);
  const [privatebox, setPrivateBox] = useState(false);
  const handleCloseAndOpenPrivateBox = () => {
    setPrivateBox(!privatebox);
  };
  const HandlesetPrivateBox = (value) => {
    setPrivateMode(value);
    setPrivateBox(!privatebox);
  };
  const tooltips = {
    0:
      trl("Công khai") +
      " - " +
      trl("Ai trên TinySocial cũng sẽ nhìn thấy bài viết này"),
    1: trl("Bạn bè") + " - " + trl("Bạn bè của bạn trên TinySocial"),
    2: trl("Chỉ mình tôi"),
  };
  const handleClickOutside = () => {
    if (!clickedInside) {
      setShowPicker(false);
    }
    setClickedInside(false);
  };
  const handleTogglePicker = () => {
    setShowPicker((prevShowPicker) => !prevShowPicker);
    setClickedInside(true);
  };
  const handleEmojiSelect = (emoji) => {
    const emojiSymbol = emoji.native;
    setDesc((prevDesc) => prevDesc + emojiSymbol);
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const video_mutation = useMutation(
    async (newPost) => {
      try {
        return await makeRequest.post("/posts/videopost", newPost);
      } catch (error) {
        alert(error.response.data);
        setPosting(false);
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
        setPosting(false);
      },
    }
  );

  const handleClick = async (e) => {
    if (!posting) {
      setPosting(true);
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("desc", desc);
      formData.append("private", privateMode);
      video_mutation.mutate(formData);
      setDesc("");
      setFile(null);
    }
  };

  return (
    <div>
      <div className="share">
        <div className="container">
          {posting && (
            <div className="loadingpopup">
              <BallInBar></BallInBar>
            </div>
          )}
          <div className="top">
            <div className="text-container">
              <div className="imgbox">
                <img
                  src={URL_OF_BACK_END + `users/profilePic/` + currentUser.id}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/upload/errorImage.png";
                  }}
                  alt={""}
                />
                <div
                  className="privatebox"
                  onClick={handleCloseAndOpenPrivateBox}
                >
                  {privateMode === 0 && (
                    <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>
                  )}
                  {privateMode === 1 && (
                    <FontAwesomeIcon icon={faUserGroup}></FontAwesomeIcon>
                  )}
                  {privateMode === 2 && (
                    <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
                  )}
                  {privatebox && (
                    <div className="changeprivate">
                      <Tooltip
                        className="pribtn"
                        title={tooltips[0]}
                        placement="bottom"
                      >
                        <FontAwesomeIcon
                          icon={faGlobe}
                          onClick={() => HandlesetPrivateBox(0)}
                          style={{ cursor: "pointer", margin: "0 5px" }}
                        />
                      </Tooltip>
                      <Tooltip
                        className="pribtn"
                        title={tooltips[1]}
                        placement="bottom"
                      >
                        <FontAwesomeIcon
                          icon={faUserGroup}
                          onClick={() => HandlesetPrivateBox(1)}
                          style={{ cursor: "pointer", margin: "0 5px" }}
                        />
                      </Tooltip>
                      <Tooltip
                        className="pribtn"
                        title={tooltips[2]}
                        placement="bottom"
                      >
                        <FontAwesomeIcon
                          icon={faLock}
                          onClick={() => HandlesetPrivateBox(2)}
                          style={{ cursor: "pointer", margin: "0 5px" }}
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
              <TextareaAutosize
                placeholder={`${trl("What's on your mind")} ${
                  currentUser.name + trl("san")
                }?`}
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                className="text-input"
              />
              <FontAwesomeIcon
                className="emo-icon"
                icon={faFaceSmileBeam}
                color="gray"
                size="xl"
                onClick={handleTogglePicker}
              />
            </div>
            <div className="file-container">
              {file && (
                <div className="preview">
                  {isImage(file) ? (
                    <img
                      className="file"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/upload/errorImage.png";
                      }}
                      alt={""}
                      src={URL.createObjectURL(file)}
                    />
                  ) : (
                    <video className="file" src={URL.createObjectURL(file)} />
                  )}
                  <button
                    className="close-button"
                    onClick={() => setFile(null)}
                  >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <hr />
          <div className="bottom">
            <div className="left">
              <input
                type="file"
                id="file"
                accept="image/*, video/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (isImageAndVideo(selectedFile)) {
                    setFile(selectedFile);
                  } else {
                    alert("Unacceptable file");
                  }
                }}
              />
              <label htmlFor="file">
                <div className="item">
                  <FontAwesomeIcon icon={faImages} color="green" size="xl" />
                  <span>
                    {trl("Image")}/{trl("Video")}
                  </span>
                </div>
              </label>
              {/* <div className="item">
                <FontAwesomeIcon icon={faLocationDot} color="red" size="xl" />
                <span>Add Place</span>
              </div>
              <div className="item">
                <FontAwesomeIcon icon={faTags} color="orange" size="xl" />
                <span>Tag Friends</span>
              </div> */}
            </div>
            <div className="right">
              <button onClick={handleClick}>{trl("Share")}</button>
            </div>
          </div>
        </div>
        {showPicker && (
          <div className="picker-container">
            <Picker
              className="picker"
              data={data}
              onEmojiSelect={handleEmojiSelect}
              onClickOutside={handleClickOutside}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Share;
function isImageAndVideo(file) {
  return (
    file &&
    (file["type"].split("/")[0] === "image" ||
      file["type"].split("/")[0] === "video")
  );
}
function isImage(file) {
  return file && file["type"].split("/")[0] === "image";
}
