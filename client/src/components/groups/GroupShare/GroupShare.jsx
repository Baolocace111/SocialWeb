import "./groupShare.scss";
import PopupWindow from "../../PopupComponent/PopupWindow";
import { useLanguage } from "../../../context/languageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faFaceSmileBeam,
  faX,
  faHeart
} from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { URL_OF_BACK_END, makeRequest } from "../../../axios";
import { useParams } from "react-router-dom";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const GroupShare = () => {
  const { trl } = useLanguage();
  const { groupId } = useParams();
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [clickedInside, setClickedInside] = useState(false);
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

  const checkOwnerAndShowPopup = async () => {
    try {
      const response = await makeRequest.get(`/groups/${groupId}`);
      const groupData = response.data[0];
      if (groupData.created_by !== currentUser.id) {
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  const groupVideoPost_mutation = useMutation(
    async (newPost) => {
      try {
        return await makeRequest.post("/posts/group-videopost", newPost);
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["group-posts"]);
        checkOwnerAndShowPopup();
      },
    }
  );

  const groupPost_mutation = useMutation(
    async (newPost) => {
      try {
        return await makeRequest.post("/posts/group-post", newPost);
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["group-posts"]);
        checkOwnerAndShowPopup();
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    const newPost = {
      desc: desc,
      groupId: groupId,
    };

    if (!file) {
      groupPost_mutation.mutate(newPost);
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("desc", desc);
      formData.append("groupId", groupId);
      groupVideoPost_mutation.mutate(formData);
    }

    setDesc("");
    setFile(null);
  };

  return (
    <>
      <div className="group-share">
        <div className="container">
          <div className="top">
            <div className="text-container">
              <img
                src={URL_OF_BACK_END + `users/profilePic/` + currentUser.id}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/upload/errorImage.png";
                }}
                alt={""}
              />
              <TextareaAutosize
                placeholder={`${trl("What's on your mind")} ${currentUser.name + trl("san")}?`}
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
                  <span>{trl("Image")}/{trl("Video")}</span>
                </div>
              </label>
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
      {showPopup && (
        <PopupWindow show={showPopup} handleClose={() => setShowPopup(false)}>
          <div className="popup-content">
            <div className="notification">
              <span>{trl("Cảm ơn bạn vì đã đăng bài")} <FontAwesomeIcon style={{ color: "red" }} icon={faHeart} /></span>
              <span>{trl("Hệ thống đã gửi bài viết cho quản trị viên duyệt.")}</span>
            </div>
            <button className="close-button" onClick={() => setShowPopup(false)}>
              <span>{trl("Đã hiểu")}</span>
            </button>
          </div>
        </PopupWindow>
      )}
    </>
  );
};

export default GroupShare;
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
