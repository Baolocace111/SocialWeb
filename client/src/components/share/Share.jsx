import "./share.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faLocationDot, faTags, faFaceSmileBeam, faX } from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/material";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newPost) => {
      try {
        return await makeRequest.post("/posts/post", newPost);
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const video_mutation = useMutation(
    async (newPost) => {
      try {
        return await makeRequest.post("/posts/videopost", newPost);
      } catch (error) {
        alert(error.response.data);
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    if ((file && isImage(file)) || !file) {
      if (file) {
        let imgUrl = await upload();
        mutation.mutate({ desc, img: imgUrl });
      } else {
        mutation.mutate({ desc });
      }
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("desc", desc);
      video_mutation.mutate(formData);
    }
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="text-container">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <TextareaAutosize
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              className="text-input"
            />
            <FontAwesomeIcon icon={faFaceSmileBeam} color="gray" size="xl" />
          </div>
          <div className="file-container">
            {file && (
              <div className="preview">
                {isImage(file) ? <img className="file" alt="" src={URL.createObjectURL(file)} />
                  : <video className="file" src={URL.createObjectURL(file)} />}
                <button className="close-button" onClick={() => setFile(null)}>
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
                <span>Image/Video</span>
              </div>
            </label>
            <div className="item">
              <FontAwesomeIcon icon={faLocationDot} color="red" size="xl" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <FontAwesomeIcon icon={faTags} color="orange" size="xl" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
function isImageAndVideo(file) {
  return file && (file["type"].split("/")[0] === "image" || file["type"].split("/")[0] === "video");
}
function isImage(file) {
  return file && (file["type"].split("/")[0] === "image");
}